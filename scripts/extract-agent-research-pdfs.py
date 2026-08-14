"""Extract ignored, local full text from the curated arXiv PDF cache."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys

try:
    from pypdf import PdfReader
except ImportError as error:  # pragma: no cover - depends on local tooling
    raise SystemExit(
        "pypdf is required for -ExtractPdfText. Install it with: python -m pip install pypdf"
    ) from error


MIN_EXTRACTED_CHARACTERS = 500


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract full text from .know/paper-cache/arxiv PDFs."
    )
    parser.add_argument("--cache", required=True, type=Path)
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-extract text even when paper.txt is newer than paper.pdf.",
    )
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def replace_isolated_surrogates(text: str) -> str:
    """Replace invalid UTF-16 surrogate code points emitted by some PDF fonts."""
    return "".join(
        "\N{REPLACEMENT CHARACTER}"
        if 0xD800 <= ord(character) <= 0xDFFF
        else character
        for character in text
    )


def has_substantial_text(text: str) -> bool:
    """Reject empty or implausibly short artifacts left by interrupted writes."""
    return len(text.strip()) >= MIN_EXTRACTED_CHARACTERS


def extract(pdf_path: Path) -> tuple[int, str]:
    reader = PdfReader(pdf_path)
    pages = []
    for page_number, page in enumerate(reader.pages, start=1):
        raw_text = replace_isolated_surrogates(page.extract_text() or "")
        page_text = "".join(
            character
            for character in raw_text
            if character in "\n\r\t" or ord(character) >= 32
        )
        pages.append(f"\n\n--- Page {page_number} ---\n\n{page_text.strip()}")
    return len(reader.pages), "".join(pages).strip() + "\n"


def main() -> int:
    args = parse_args()
    cache = args.cache.resolve()
    if not cache.is_dir():
        raise SystemExit(f"PDF cache does not exist: {cache}")

    records = []
    failures = []
    pdfs = sorted(cache.glob("arxiv-*/paper.pdf"))

    for index, pdf_path in enumerate(pdfs, start=1):
        paper_id = pdf_path.parent.name.removeprefix("arxiv-")
        text_path = pdf_path.with_name("paper.txt")
        try:
            reuse_cached_text = (
                not args.force
                and text_path.exists()
                and text_path.stat().st_mtime_ns >= pdf_path.stat().st_mtime_ns
            )
            if reuse_cached_text:
                text = text_path.read_text(encoding="utf-8")
                reuse_cached_text = has_substantial_text(text)

            if reuse_cached_text:
                page_count = text.count("--- Page ")
            else:
                page_count, text = extract(pdf_path)
                if not has_substantial_text(text):
                    raise ValueError("extracted text is unexpectedly short")
                text_path.write_text(text, encoding="utf-8", newline="\n")

            records.append(
                {
                    "id": paper_id,
                    "pdf": f"arxiv-{paper_id}/paper.pdf",
                    "text": f"arxiv-{paper_id}/paper.txt",
                    "pages": page_count,
                    "characters": len(text),
                    "pdf_sha256": sha256(pdf_path),
                }
            )
        except Exception as error:  # continue to report every bad source
            failures.append({"id": paper_id, "error": f"{type(error).__name__}: {error}"})

        if index % 10 == 0 or index == len(pdfs):
            print(f"[full-text] {index}/{len(pdfs)} papers processed", flush=True)

    manifest = {
        "schema_version": 1,
        "papers": records,
        "failures": failures,
    }
    (cache / "full-text-manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )

    if failures:
        for failure in failures:
            print(f"ERROR {failure['id']}: {failure['error']}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
