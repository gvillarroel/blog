"""Regression tests for the local PDF text extractor."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import unittest


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
EXTRACTOR_PATH = REPOSITORY_ROOT / "scripts" / "extract-agent-research-pdfs.py"
SPEC = importlib.util.spec_from_file_location("pdf_text_extractor", EXTRACTOR_PATH)
assert SPEC is not None and SPEC.loader is not None
EXTRACTOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(EXTRACTOR)


class UnicodeSanitizationTest(unittest.TestCase):
    def test_isolated_surrogate_is_replaced_before_utf8_encoding(self) -> None:
        sanitized = EXTRACTOR.replace_isolated_surrogates("before\ud835after")

        self.assertEqual(sanitized, "before\N{REPLACEMENT CHARACTER}after")
        self.assertEqual(
            sanitized.encode("utf-8").decode("utf-8"),
            "before\N{REPLACEMENT CHARACTER}after",
        )

    def test_valid_non_bmp_character_is_preserved(self) -> None:
        self.assertEqual(
            EXTRACTOR.replace_isolated_surrogates("graph \U0001F5FA"),
            "graph \U0001F5FA",
        )

    def test_truncated_cache_artifact_is_not_reusable(self) -> None:
        self.assertFalse(EXTRACTOR.has_substantial_text(""))
        self.assertFalse(EXTRACTOR.has_substantial_text("--- Page 1 ---\n"))
        self.assertTrue(
            EXTRACTOR.has_substantial_text(
                "--- Page 1 ---\n" + "graph reasoning " * 40
            )
        )


if __name__ == "__main__":
    unittest.main()
