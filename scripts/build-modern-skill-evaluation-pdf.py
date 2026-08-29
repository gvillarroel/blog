#!/usr/bin/env python3
"""Build the modern skill-evaluation guide as a print-quality PDF with Chrome."""

from __future__ import annotations

import argparse
import html
from pathlib import Path
import subprocess
import tempfile

import markdown


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = REPO_ROOT / "docs" / "modern-skill-evaluation.md"
DEFAULT_OUTPUT = (
    REPO_ROOT
    / "output"
    / "pdf"
    / "modern-skill-evaluation-framework-selection-guide.pdf"
)
CHROME_CANDIDATES = (
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
)


def find_chrome() -> Path:
    for candidate in CHROME_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Google Chrome was not found in a standard Windows location")


def build_html(source: Path) -> str:
    source_text = source.read_text(encoding="utf-8")

    # Chrome prints the authored SVGs correctly, but the D3 PNG snapshots provide
    # deterministic typography and a compact PDF while retaining the HTML/SVG sources
    # in the companion bundle.
    source_text = source_text.replace(
        "assets/modern-skill-evaluation/definition-rails.svg",
        "assets/modern-skill-evaluation/definition-rails.png",
    ).replace(
        "assets/modern-skill-evaluation/capability-landscape.svg",
        "assets/modern-skill-evaluation/capability-landscape.png",
    )

    body = markdown.markdown(
        source_text,
        extensions=["extra", "sane_lists", "tables", "fenced_code", "toc"],
        output_format="html5",
    )
    docs_base = source.parent.resolve().as_uri().rstrip("/") + "/"

    css = r"""
      @page {
        size: A4;
        margin: 14mm 14mm 16mm;
      }

      * { box-sizing: border-box; }

      html {
        color: #111827;
        background: #ffffff;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10pt;
        line-height: 1.45;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body {
        margin: 0;
        background: #ffffff;
      }

      h1, h2, h3, h4 {
        color: #0f2742;
        line-height: 1.16;
        break-after: avoid-page;
        page-break-after: avoid;
      }

      h1 {
        margin: 0 0 4mm;
        font-size: 27pt;
        letter-spacing: -0.45pt;
      }

      h2 {
        margin: 8mm 0 3mm;
        padding-bottom: 1.5mm;
        border-bottom: 1.2pt solid #9fb5c8;
        font-size: 17pt;
      }

      h3 {
        margin: 5mm 0 2mm;
        color: #005ea8;
        font-size: 12.6pt;
      }

      h4 { font-size: 10.8pt; }

      p { margin: 0 0 2.8mm; }

      strong { color: #0f2742; }

      a {
        color: #005ea8;
        text-decoration: none;
      }

      blockquote {
        margin: 5mm 0;
        padding: 4mm 5mm;
        border-left: 4pt solid #005ea8;
        background: #e8f4fc;
        color: #0f2a3d;
        break-inside: avoid-page;
      }

      blockquote p { margin: 0; }

      ul, ol {
        margin: 0 0 3mm 5.5mm;
        padding-left: 4.5mm;
      }

      li { margin-bottom: 1.2mm; }

      img {
        display: block;
        width: 100%;
        height: auto;
        max-height: 164mm;
        margin: 4mm auto 2mm;
        object-fit: contain;
        object-position: center;
        break-inside: avoid-page;
        page-break-inside: avoid;
      }

      img[src$="skill-evaluation-hero.png"] { max-height: 112mm; }
      img[src$="definition-rails.png"] { max-height: 121mm; }
      img[src$="capability-landscape.png"] { max-height: 151mm; }

      p:has(> img) {
        margin: 4mm 0 1.5mm;
        break-inside: avoid-page;
        page-break-inside: avoid;
      }

      p:has(> img) + p {
        break-before: avoid-page;
        page-break-before: avoid;
      }

      table {
        width: 100%;
        margin: 3mm 0 4mm;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 7.2pt;
        line-height: 1.28;
      }

      thead { display: table-header-group; }
      tr { break-inside: avoid-page; page-break-inside: avoid; }

      th, td {
        padding: 1.6mm 1.7mm;
        border: 0.6pt solid #a9b8c7;
        vertical-align: top;
        overflow-wrap: anywhere;
      }

      th {
        background: #e8f4fc;
        color: #0f2742;
        font-weight: 700;
        text-align: left;
      }

      tbody tr:nth-child(even) td { background: #f8fafc; }

      code {
        padding: 0.15em 0.3em;
        border-radius: 3px;
        background: #eef2f7;
        color: #7a2416;
        font-family: Consolas, "Courier New", monospace;
        font-size: 0.88em;
      }

      pre {
        margin: 3mm 0 4mm;
        padding: 3mm;
        border: 0.6pt solid #cbd5e1;
        border-radius: 5px;
        background: #f8fafc;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        break-inside: avoid-page;
        page-break-inside: avoid;
      }

      pre code {
        padding: 0;
        background: transparent;
        color: #111827;
        font-size: 7.5pt;
        line-height: 1.3;
      }

      hr {
        margin: 5mm 0;
        border: 0;
        border-top: 0.8pt solid #cbd5e1;
      }
    """

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="{html.escape(docs_base, quote=True)}" />
    <title>Modern Skill Evaluation and Evolution</title>
    <style>{css}</style>
  </head>
  <body>{body}</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    source = args.source.resolve()
    output = args.output.resolve()
    if not source.exists():
        raise FileNotFoundError(source)

    output.parent.mkdir(parents=True, exist_ok=True)
    chrome = find_chrome()
    html_text = build_html(source)

    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            suffix=".html",
            prefix="modern-skill-evaluation-",
            dir=output.parent,
            delete=False,
        ) as temp_file:
            temp_file.write(html_text)
            temp_path = Path(temp_file.name)

        command = [
            str(chrome),
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--allow-file-access-from-files",
            "--no-first-run",
            "--no-default-browser-check",
            "--no-pdf-header-footer",
            f"--print-to-pdf={output}",
            temp_path.resolve().as_uri(),
        ]
        subprocess.run(command, check=True)
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)

    if not output.exists() or output.stat().st_size < 10_000:
        raise RuntimeError(f"Chrome did not produce a valid PDF at {output}")

    print(f"PDF: {output}")
    print(f"Bytes: {output.stat().st_size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
