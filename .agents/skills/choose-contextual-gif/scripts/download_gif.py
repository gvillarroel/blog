#!/usr/bin/env python3
"""Resolve and safely download a GIF selected from the local catalog."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html
import json
import os
import re
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Callable
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener


SKILL_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = Path(__file__).resolve().parents[4]
CATALOG_PATH = SKILL_ROOT / "references" / "gif-catalog.json"
API_ENDPOINT = "https://api.giphy.com/v1/gifs/{gif_id}"
RATING_ORDER = {"g": 0, "pg": 1, "pg-13": 2, "r": 3}
RENDITIONS = {"original", "downsized", "fixed_width"}
MAX_HTML_BYTES = 2_000_000
USER_AGENT = "choose-contextual-gif-downloader/1.0"
OpenUrl = Callable[..., Any]


class DownloadError(RuntimeError):
    """Raised when resolution or download cannot be completed safely."""


class SocialImageParser(HTMLParser):
    """Collect GIF-looking Open Graph and Twitter image candidates."""

    def __init__(self) -> None:
        super().__init__()
        self.candidates: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.casefold() != "meta":
            return
        values = {key.casefold(): value for key, value in attrs if key and value}
        name = (values.get("property") or values.get("name") or "").casefold()
        content = values.get("content")
        if name in {"og:image", "og:image:url", "twitter:image"} and content:
            self.candidates.append((name, html.unescape(content)))


class GiphyRedirectHandler(HTTPRedirectHandler):
    """Stop redirects before a request can leave GIPHY-controlled hosts."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not is_giphy_url(newurl):
            raise DownloadError("Refusing a redirect outside trusted GIPHY HTTPS hosts.")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def open_giphy(request: Request, timeout: float):
    return build_opener(GiphyRedirectHandler()).open(request, timeout=timeout)


def load_catalog(path: Path = CATALOG_PATH) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def is_giphy_url(value: str, *, media_only: bool = False) -> bool:
    parsed = urlparse(value)
    host = (parsed.hostname or "").casefold()
    if parsed.scheme != "https" or parsed.username or parsed.password:
        return False
    if host != "giphy.com" and not host.endswith(".giphy.com"):
        return False
    if media_only and host in {"giphy.com", "www.giphy.com", "api.giphy.com"}:
        return False
    return True


def resolve_catalog_entry(source: str, catalog: dict[str, Any]) -> dict[str, Any]:
    needle = source.strip()
    for entry in catalog["entries"]:
        if needle in {entry["id"], entry["provider_id"], entry["url"]}:
            return entry
    raise DownloadError(
        f"No catalog entry matches {needle!r}. Use a catalog id, GIPHY id, or exact catalog permalink."
    )


def enforce_rating(entry: dict[str, Any], max_rating: str) -> None:
    rating = entry.get("rating")
    if rating not in RATING_ORDER:
        raise DownloadError(f"Catalog entry has an unknown rating: {rating!r}.")
    if RATING_ORDER[rating] > RATING_ORDER[max_rating]:
        raise DownloadError(
            f"{entry['id']} is rated {rating}, above the requested {max_rating} ceiling."
        )


def read_limited(response: Any, limit: int, label: str) -> bytes:
    data = response.read(limit + 1)
    if len(data) > limit:
        raise DownloadError(f"{label} exceeded the {limit:,}-byte safety limit.")
    return data


def fetch_api_metadata(
    entry: dict[str, Any],
    api_key: str,
    rendition: str,
    max_rating: str,
    timeout: float,
    opener: OpenUrl = open_giphy,
) -> dict[str, Any]:
    query = urlencode(
        {
            "api_key": api_key,
            "rating": max_rating,
            "fields": f"id,url,title,username,source,images.{rendition}",
        }
    )
    endpoint = API_ENDPOINT.format(gif_id=quote(entry["provider_id"], safe="")) + "?" + query
    request = Request(endpoint, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with opener(request, timeout=timeout) as response:
            final_url = response.geturl() if hasattr(response, "geturl") else endpoint
            if not is_giphy_url(final_url):
                raise DownloadError("GIPHY API redirected outside trusted HTTPS hosts.")
            payload = json.loads(read_limited(response, 5_000_000, "GIPHY API response"))
    except HTTPError as exc:
        raise DownloadError(f"GIPHY API returned HTTP {exc.code}; the API key was not printed.") from exc
    except URLError as exc:
        raise DownloadError(f"Could not reach the GIPHY API: {exc.reason}.") from exc
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise DownloadError("GIPHY API returned invalid JSON.") from exc

    data = payload.get("data")
    if not isinstance(data, dict) or not data:
        status = payload.get("meta", {}).get("status")
        message = payload.get("meta", {}).get("msg")
        suffix = f" ({status}: {message})" if status or message else ""
        raise DownloadError(f"GIPHY returned no GIF metadata{suffix}.")
    if data.get("id") != entry["provider_id"]:
        raise DownloadError("GIPHY API response id did not match the requested GIF.")
    image = data.get("images", {}).get(rendition)
    media_url = image.get("url") if isinstance(image, dict) else None
    if not isinstance(media_url, str) or not is_giphy_url(media_url, media_only=True):
        raise DownloadError(f"GIPHY did not return a trusted {rendition} media URL.")
    return {
        "method": "giphy-api",
        "media_url": media_url,
        "rendition": rendition,
        "api_title": data.get("title"),
        "api_username": data.get("username"),
        "api_source": data.get("source"),
        "declared_size": image.get("size"),
        "width": image.get("width"),
        "height": image.get("height"),
    }


def fetch_page_metadata(
    entry: dict[str, Any],
    rendition: str,
    timeout: float,
    opener: OpenUrl = open_giphy,
) -> dict[str, Any]:
    if rendition != "original":
        raise DownloadError("Public-page fallback supports only the original rendition; use the API for others.")
    if not is_giphy_url(entry["url"]):
        raise DownloadError("Catalog permalink is not a trusted HTTPS GIPHY URL.")
    request = Request(
        entry["url"],
        headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"},
    )
    try:
        with opener(request, timeout=timeout) as response:
            final_url = response.geturl() if hasattr(response, "geturl") else entry["url"]
            if not is_giphy_url(final_url):
                raise DownloadError("GIPHY page redirected outside trusted HTTPS hosts.")
            charset = "utf-8"
            headers = getattr(response, "headers", None)
            if headers and hasattr(headers, "get_content_charset"):
                charset = headers.get_content_charset() or charset
            page = read_limited(response, MAX_HTML_BYTES, "GIPHY page").decode(charset, "replace")
    except HTTPError as exc:
        raise DownloadError(f"GIPHY page returned HTTP {exc.code}.") from exc
    except URLError as exc:
        raise DownloadError(f"Could not reach the GIPHY page: {exc.reason}.") from exc

    parser = SocialImageParser()
    parser.feed(page)
    candidates = [
        (kind, value)
        for kind, value in parser.candidates
        if is_giphy_url(value, media_only=True) and urlparse(value).path.casefold().endswith(".gif")
    ]
    if not candidates:
        raise DownloadError("No trusted GIF URL was found in the page metadata; configure GIPHY_API_KEY.")
    candidates.sort(
        key=lambda candidate: (
            0 if urlparse(candidate[1]).path.casefold().endswith("/giphy.gif") else 1,
            0 if candidate[0].startswith("og:") else 1,
        )
    )
    return {
        "method": "giphy-page-metadata",
        "media_url": candidates[0][1],
        "rendition": "original",
        "api_title": None,
        "api_username": None,
        "api_source": None,
        "declared_size": None,
        "width": None,
        "height": None,
    }


def resolve_media(
    entry: dict[str, Any],
    resolution: str,
    rendition: str,
    max_rating: str,
    api_key_env: str,
    timeout: float,
    opener: OpenUrl = open_giphy,
) -> dict[str, Any]:
    enforce_rating(entry, max_rating)
    api_key = os.environ.get(api_key_env, "").strip()
    method = resolution
    if method == "auto":
        method = "api" if api_key else "page"
    if method == "api":
        if not api_key:
            raise DownloadError(f"Set {api_key_env} or use --resolution page.")
        return fetch_api_metadata(entry, api_key, rendition, max_rating, timeout, opener)
    return fetch_page_metadata(entry, rendition, timeout, opener)


def workspace_output_dir(value: str, *, create: bool = True) -> Path:
    requested = Path(value)
    if not requested.is_absolute():
        requested = WORKSPACE_ROOT / requested
    resolved = requested.resolve()
    try:
        resolved.relative_to(WORKSPACE_ROOT)
    except ValueError as exc:
        raise DownloadError(f"Output directory must stay inside {WORKSPACE_ROOT}.") from exc
    if create:
        resolved.mkdir(parents=True, exist_ok=True)
        resolved = resolved.resolve()
        try:
            resolved.relative_to(WORKSPACE_ROOT)
        except ValueError as exc:
            raise DownloadError("Resolved output directory escapes the workspace through a link.") from exc
    return resolved


def output_filename(entry: dict[str, Any], requested: str | None) -> str:
    value = requested or entry["id"]
    if Path(value).name != value or value in {".", ".."}:
        raise DownloadError("Filename must not contain a directory path.")
    if not value.casefold().endswith(".gif"):
        value += ".gif"
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*\.gif", value, re.IGNORECASE):
        raise DownloadError("Filename may contain only letters, numbers, dots, underscores, and hyphens.")
    return value


def download_media(
    media_url: str,
    destination: Path,
    max_bytes: int,
    timeout: float,
    overwrite: bool,
    opener: OpenUrl = open_giphy,
) -> dict[str, Any]:
    if not is_giphy_url(media_url, media_only=True):
        raise DownloadError("Refusing a media URL outside trusted GIPHY HTTPS hosts.")
    if destination.exists() and not overwrite:
        raise DownloadError(f"Destination already exists: {destination}. Use --overwrite explicitly.")

    request = Request(media_url, headers={"User-Agent": USER_AGENT, "Accept": "image/gif"})
    temporary: Path | None = None
    try:
        with opener(request, timeout=timeout) as response:
            final_url = response.geturl() if hasattr(response, "geturl") else media_url
            if not is_giphy_url(final_url, media_only=True):
                raise DownloadError("Download redirected outside trusted GIPHY HTTPS hosts.")
            headers = getattr(response, "headers", {})
            content_type = (headers.get("Content-Type", "") or "").split(";", 1)[0].strip().casefold()
            declared = headers.get("Content-Length")
            if declared:
                try:
                    if int(declared) > max_bytes:
                        raise DownloadError(f"GIF exceeds the {max_bytes:,}-byte limit.")
                except ValueError:
                    pass

            digest = hashlib.sha256()
            total = 0
            first = True
            with tempfile.NamedTemporaryFile(
                mode="wb", prefix=f".{destination.stem}-", suffix=".part", dir=destination.parent, delete=False
            ) as handle:
                temporary = Path(handle.name)
                while True:
                    chunk = response.read(min(64 * 1024, max_bytes + 1 - total))
                    if not chunk:
                        break
                    if first:
                        first = False
                        if len(chunk) < 6 or chunk[:6] not in {b"GIF87a", b"GIF89a"}:
                            raise DownloadError("Downloaded content does not have a valid GIF signature.")
                    total += len(chunk)
                    if total > max_bytes:
                        raise DownloadError(f"GIF exceeds the {max_bytes:,}-byte limit.")
                    digest.update(chunk)
                    handle.write(chunk)
            if total == 0:
                raise DownloadError("Downloaded GIF was empty.")
            if content_type and content_type != "image/gif":
                raise DownloadError(f"Unexpected media content type: {content_type}.")
            if destination.exists() and not overwrite:
                raise DownloadError(f"Destination appeared during download: {destination}.")
            os.replace(temporary, destination)
            temporary = None
            return {
                "path": str(destination),
                "bytes": total,
                "sha256": digest.hexdigest(),
                "content_type": content_type or "image/gif",
                "final_url": final_url,
            }
    except HTTPError as exc:
        raise DownloadError(f"GIF download returned HTTP {exc.code}.") from exc
    except URLError as exc:
        raise DownloadError(f"Could not download the GIF: {exc.reason}.") from exc
    finally:
        if temporary and temporary.exists():
            temporary.unlink()


def write_sidecar(
    destination: Path,
    entry: dict[str, Any],
    catalog: dict[str, Any],
    resolution: dict[str, Any],
    downloaded: dict[str, Any],
    overwrite: bool,
) -> Path:
    sidecar = destination.with_suffix(".json")
    if sidecar.exists() and not overwrite:
        raise DownloadError(f"Metadata sidecar already exists: {sidecar}. Use --overwrite explicitly.")
    payload = {
        "schema_version": 1,
        "downloaded_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "catalog_updated_at": catalog["updated_at"],
        "catalog_id": entry["id"],
        "provider": catalog.get("default_provider", "giphy"),
        "provider_id": entry["provider_id"],
        "canonical_page": entry["url"],
        "label": entry["label"],
        "alt": entry["alt"],
        "rating": entry["rating"],
        "provider_title": resolution.get("api_title"),
        "provider_username": resolution.get("api_username"),
        "provider_source": resolution.get("api_source"),
        "resolution_method": resolution["method"],
        "rendition": resolution["rendition"],
        "media_url_at_download": downloaded["final_url"],
        "content_type": downloaded["content_type"],
        "bytes": downloaded["bytes"],
        "sha256": downloaded["sha256"],
        "attribution_note": "Powered by GIPHY; preserve creator attribution when available.",
        "terms": "https://support.giphy.com/hc/en-us/articles/360028134111-GIPHY-API-Terms-of-Service",
    }
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            prefix=f".{sidecar.stem}-",
            suffix=".json.part",
            dir=sidecar.parent,
            delete=False,
            encoding="utf-8",
        ) as handle:
            temporary = Path(handle.name)
            json.dump(payload, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
        os.replace(temporary, sidecar)
        temporary = None
    finally:
        if temporary and temporary.exists():
            temporary.unlink()
    return sidecar


def public_resolution(entry: dict[str, Any], resolution: dict[str, Any]) -> dict[str, Any]:
    return {
        "catalog_id": entry["id"],
        "label": entry["label"],
        "provider_id": entry["provider_id"],
        "canonical_page": entry["url"],
        "rating": entry["rating"],
        "alt": entry["alt"],
        **resolution,
    }


def render_text(payload: dict[str, Any], downloaded: bool) -> str:
    if not downloaded:
        return "\n".join(
            [
                f"Resolved: {payload['label']} ({payload['catalog_id']})",
                f"Method: {payload['method']}",
                f"Rendition: {payload['rendition']}",
                f"Media URL: {payload['media_url']}",
                "No file was downloaded.",
            ]
        )
    lines = [
        f"Downloaded: {payload['path']}",
        f"Bytes: {payload['bytes']:,}",
        f"SHA-256: {payload['sha256']}",
        f"Source: {payload['canonical_page']}",
    ]
    if payload.get("sidecar"):
        lines.append(f"Metadata: {payload['sidecar']}")
    return "\n".join(lines)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Safely download a GIPHY GIF selected from the contextual GIF catalog."
    )
    parser.add_argument("source", help="Catalog id, GIPHY id, or exact catalog permalink")
    parser.add_argument("--output-dir", help="Destination inside the project root; required for download")
    parser.add_argument("--filename", help="Optional safe filename; .gif is added when omitted")
    parser.add_argument("--rendition", choices=sorted(RENDITIONS), default="original")
    parser.add_argument("--max-rating", choices=list(RATING_ORDER), default="g")
    parser.add_argument("--resolution", choices=("auto", "api", "page"), default="auto")
    parser.add_argument("--api-key-env", default="GIPHY_API_KEY", help="Environment variable containing the API key")
    parser.add_argument("--timeout", type=float, default=20.0)
    parser.add_argument("--max-mib", type=int, default=25, help="Maximum download size in MiB")
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--no-sidecar", action="store_true", help="Do not save provenance metadata")
    parser.add_argument("--resolve-only", action="store_true", help="Resolve media metadata without downloading")
    parser.add_argument(
        "--confirm-rights",
        action="store_true",
        help="Confirm that the intended download and use are permitted",
    )
    parser.add_argument("--format", choices=("text", "json"), default="text")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.timeout <= 0 or args.timeout > 120:
        parser.error("--timeout must be greater than 0 and at most 120 seconds")
    if args.max_mib < 1 or args.max_mib > 200:
        parser.error("--max-mib must be between 1 and 200")
    if not args.resolve_only and not args.confirm_rights:
        parser.error("downloading requires --confirm-rights after verifying the intended use")
    if not args.resolve_only and not args.output_dir:
        parser.error("--output-dir is required when downloading")

    try:
        catalog = load_catalog()
        entry = resolve_catalog_entry(args.source, catalog)
        output_dir: Path | None = None
        destination: Path | None = None
        if not args.resolve_only:
            output_dir = workspace_output_dir(args.output_dir)
            destination = output_dir / output_filename(entry, args.filename)
            sidecar_path = destination.with_suffix(".json")
            if destination.exists() and not args.overwrite:
                raise DownloadError(f"Destination already exists: {destination}. Use --overwrite explicitly.")
            if not args.no_sidecar and sidecar_path.exists() and not args.overwrite:
                raise DownloadError(f"Metadata sidecar already exists: {sidecar_path}. Use --overwrite explicitly.")
        resolution = resolve_media(
            entry,
            args.resolution,
            args.rendition,
            args.max_rating,
            args.api_key_env,
            args.timeout,
        )
        resolved_payload = public_resolution(entry, resolution)
        if args.resolve_only:
            print(
                json.dumps(resolved_payload, ensure_ascii=False, indent=2)
                if args.format == "json"
                else render_text(resolved_payload, downloaded=False)
            )
            return 0
        assert destination is not None
        downloaded = download_media(
            resolution["media_url"],
            destination,
            args.max_mib * 1024 * 1024,
            args.timeout,
            args.overwrite,
        )
        payload = {
            **downloaded,
            "catalog_id": entry["id"],
            "canonical_page": entry["url"],
            "resolution_method": resolution["method"],
            "rendition": resolution["rendition"],
        }
        if not args.no_sidecar:
            payload["sidecar"] = str(
                write_sidecar(destination, entry, catalog, resolution, downloaded, args.overwrite)
            )
        print(json.dumps(payload, ensure_ascii=False, indent=2) if args.format == "json" else render_text(payload, True))
        return 0
    except (DownloadError, OSError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
