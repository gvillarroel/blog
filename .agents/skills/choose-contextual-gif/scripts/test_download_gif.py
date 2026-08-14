#!/usr/bin/env python3
"""Unit tests for the catalog-backed GIF downloader."""

from __future__ import annotations

import email.message
import io
import json
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr
from pathlib import Path
from unittest import mock


SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import download_gif  # noqa: E402


class FakeResponse:
    def __init__(self, data: bytes, url: str, content_type: str) -> None:
        self.stream = io.BytesIO(data)
        self.url = url
        self.status = 200
        self.headers = email.message.Message()
        self.headers["Content-Type"] = content_type
        self.headers["Content-Length"] = str(len(data))

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback):
        return False

    def read(self, size: int = -1) -> bytes:
        return self.stream.read(size)

    def geturl(self) -> str:
        return self.url


class DownloadGifTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.catalog = download_gif.load_catalog()
        cls.hamster = download_gif.resolve_catalog_entry("hamster-wheel-running", cls.catalog)

    def test_catalog_entry_resolves_by_all_supported_identifiers(self):
        for source in (self.hamster["id"], self.hamster["provider_id"], self.hamster["url"]):
            with self.subTest(source=source):
                self.assertEqual(self.hamster, download_gif.resolve_catalog_entry(source, self.catalog))

    def test_unknown_entry_is_rejected(self):
        with self.assertRaises(download_gif.DownloadError):
            download_gif.resolve_catalog_entry("not-in-the-catalog", self.catalog)

    def test_giphy_host_validation_rejects_lookalikes_and_credentials(self):
        self.assertTrue(download_gif.is_giphy_url("https://media3.giphy.com/media/id/giphy.gif", media_only=True))
        self.assertFalse(download_gif.is_giphy_url("https://giphy.com.evil.example/giphy.gif", media_only=True))
        self.assertFalse(download_gif.is_giphy_url("https://user:pass@media.giphy.com/x.gif", media_only=True))

    def test_redirect_handler_blocks_external_host_before_following(self):
        handler = download_gif.GiphyRedirectHandler()
        request = download_gif.Request("https://giphy.com/gifs/example")
        with self.assertRaises(download_gif.DownloadError):
            handler.redirect_request(
                request,
                None,
                302,
                "Found",
                email.message.Message(),
                "https://evil.example/tracker.gif",
            )

    def test_page_metadata_prefers_original_gif_over_webp_and_preview(self):
        page = b"""<html><head>
            <meta property='og:image' content='https://media3.giphy.com/media/id/giphy.webp'>
            <meta name='twitter:image' content='https://media3.giphy.com/media/id/giphy_s.gif'>
            <meta content='https://media3.giphy.com/media/id/giphy.gif' property='og:image'>
        </head></html>"""
        opener = lambda request, timeout: FakeResponse(page, self.hamster["url"], "text/html; charset=utf-8")
        result = download_gif.fetch_page_metadata(self.hamster, "original", 2, opener)
        self.assertEqual("giphy-page-metadata", result["method"])
        self.assertTrue(result["media_url"].endswith("/giphy.gif"))

    def test_page_fallback_rejects_non_original_rendition(self):
        with self.assertRaises(download_gif.DownloadError):
            download_gif.fetch_page_metadata(self.hamster, "downsized", 2)

    def test_page_redirect_outside_giphy_is_rejected(self):
        page = b"<meta property='og:image' content='https://media.giphy.com/media/id/giphy.gif'>"
        opener = lambda request, timeout: FakeResponse(page, "https://evil.example/page", "text/html")
        with self.assertRaises(download_gif.DownloadError):
            download_gif.fetch_page_metadata(self.hamster, "original", 2, opener)

    def test_rating_ceiling_is_enforced_before_network(self):
        pg_entry = next(entry for entry in self.catalog["entries"] if entry["rating"] == "pg")
        with self.assertRaises(download_gif.DownloadError):
            download_gif.resolve_media(pg_entry, "page", "original", "g", "GIPHY_API_KEY", 2)

    def test_api_key_is_read_from_environment_and_not_returned(self):
        api_payload = {
            "data": {
                "id": self.hamster["provider_id"],
                "title": "Hamster",
                "images": {
                    "original": {
                        "url": "https://media3.giphy.com/media/id/giphy.gif",
                        "size": "42",
                    }
                },
            },
            "meta": {"status": 200},
        }
        body = json.dumps(api_payload).encode()
        seen_url: list[str] = []

        def opener(request, timeout):
            seen_url.append(request.full_url)
            return FakeResponse(body, request.full_url, "application/json")

        with mock.patch.dict("os.environ", {"TEST_GIPHY_KEY": "secret-value"}, clear=False):
            result = download_gif.resolve_media(
                self.hamster, "auto", "original", "g", "TEST_GIPHY_KEY", 2, opener
            )
        self.assertEqual("giphy-api", result["method"])
        self.assertIn("secret-value", seen_url[0])
        self.assertNotIn("secret-value", json.dumps(result))

    def test_output_directory_cannot_escape_workspace(self):
        outside = download_gif.WORKSPACE_ROOT.parent / "outside-gif-test"
        with self.assertRaises(download_gif.DownloadError):
            download_gif.workspace_output_dir(str(outside), create=False)

    def test_filename_rejects_path_traversal(self):
        for value in ("../escape.gif", "folder/escape.gif", r"folder\escape.gif"):
            with self.subTest(value=value), self.assertRaises(download_gif.DownloadError):
                download_gif.output_filename(self.hamster, value)

    def test_valid_gif_is_downloaded_atomically_and_hashed(self):
        media_url = "https://media3.giphy.com/media/id/giphy.gif"
        content = b"GIF89a" + b"test-payload"
        opener = lambda request, timeout: FakeResponse(content, media_url, "image/gif")
        with tempfile.TemporaryDirectory(prefix="gif-download-test-", dir=SCRIPT_DIR) as directory:
            destination = Path(directory) / "hamster.gif"
            result = download_gif.download_media(media_url, destination, 1024, 2, False, opener)
            self.assertEqual(content, destination.read_bytes())
            self.assertEqual(len(content), result["bytes"])
            self.assertEqual(64, len(result["sha256"]))
            self.assertEqual([], list(Path(directory).glob("*.part")))

    def test_sidecar_preserves_provider_provenance(self):
        resolution = {
            "method": "giphy-api",
            "rendition": "original",
            "api_title": "Hamster Wheel",
            "api_username": "example-creator",
            "api_source": "https://creator.example/source",
        }
        downloaded = {
            "final_url": "https://media3.giphy.com/media/id/giphy.gif",
            "content_type": "image/gif",
            "bytes": 12,
            "sha256": "a" * 64,
        }
        with tempfile.TemporaryDirectory(prefix="gif-sidecar-test-", dir=SCRIPT_DIR) as directory:
            destination = Path(directory) / "hamster.gif"
            sidecar = download_gif.write_sidecar(
                destination, self.hamster, self.catalog, resolution, downloaded, False
            )
            payload = json.loads(sidecar.read_text(encoding="utf-8"))
            self.assertEqual("example-creator", payload["provider_username"])
            self.assertEqual(self.hamster["url"], payload["canonical_page"])
            self.assertEqual("a" * 64, payload["sha256"])

    def test_invalid_signature_leaves_no_partial_file(self):
        media_url = "https://media3.giphy.com/media/id/giphy.gif"
        opener = lambda request, timeout: FakeResponse(b"not-a-gif", media_url, "text/html")
        with tempfile.TemporaryDirectory(prefix="gif-download-test-", dir=SCRIPT_DIR) as directory:
            destination = Path(directory) / "bad.gif"
            with self.assertRaises(download_gif.DownloadError):
                download_gif.download_media(media_url, destination, 1024, 2, False, opener)
            self.assertFalse(destination.exists())
            self.assertEqual([], list(Path(directory).iterdir()))

    def test_cli_help_succeeds_without_network(self):
        completed = subprocess.run(
            [sys.executable, str(SCRIPT_DIR / "download_gif.py"), "--help"],
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(0, completed.returncode, completed.stderr)
        self.assertIn("--confirm-rights", completed.stdout)

    def test_missing_rights_confirmation_fails_before_resolution(self):
        with mock.patch.object(download_gif, "load_catalog") as load_catalog:
            with redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as raised:
                download_gif.main(["hamster-wheel-running", "--output-dir", "output/gifs"])
        self.assertEqual(2, raised.exception.code)
        load_catalog.assert_not_called()

    def test_outside_output_fails_before_network_resolution(self):
        outside = download_gif.WORKSPACE_ROOT.parent / "outside-gif-test"
        with mock.patch.object(download_gif, "resolve_media") as resolve_media:
            with redirect_stderr(io.StringIO()):
                result = download_gif.main(
                    [
                        "hamster-wheel-running",
                        "--output-dir",
                        str(outside),
                        "--confirm-rights",
                    ]
                )
        self.assertEqual(2, result)
        resolve_media.assert_not_called()

    def test_skill_routes_downloads_through_guarded_script(self):
        instructions = (download_gif.SKILL_ROOT / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("scripts/download_gif.py", instructions)
        self.assertIn("--confirm-rights", instructions)
        self.assertIn("GIPHY_API_KEY", instructions)


if __name__ == "__main__":
    unittest.main(verbosity=2)
