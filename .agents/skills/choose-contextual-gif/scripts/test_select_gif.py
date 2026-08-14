#!/usr/bin/env python3
"""Regression tests for the contextual GIF selector and its catalog."""

from __future__ import annotations

import datetime as dt
import subprocess
import sys
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import select_gif  # noqa: E402


class CatalogTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.catalog = select_gif.load_catalog()
        cls.as_of = dt.date(2026, 8, 13)

    def choose(self, context: str, **kwargs):
        defaults = {
            "catalog": self.catalog,
            "context": context,
            "audience": "team-chat",
            "as_of": self.as_of,
        }
        defaults.update(kwargs)
        return select_gif.select_gifs(**defaults)

    def test_catalog_is_valid_and_substantial(self):
        self.assertEqual([], select_gif.validate_catalog(self.catalog))
        self.assertGreaterEqual(len(self.catalog["entries"]), 75)

    def test_spanish_work_start_includes_animal_work_metaphors(self):
        result = self.choose(
            "Arrancamos a trabajar: manos a la obra",
            tone="playful",
            no_people=True,
            limit=5,
        )
        ids = {item["id"] for item in result["candidates"]}
        self.assertEqual("recommend", result["decision"])
        self.assertIn("hamster-wheel-running", ids)
        self.assertTrue(ids & {"cat-working-fast", "shiba-typing-from-couch"})
        self.assertTrue(all(not item["people"] for item in result["candidates"]))

    def test_waiting_for_ci_returns_waiting_metaphor(self):
        result = self.choose("Waiting for CI to finish", limit=5)
        ids = {item["id"] for item in result["candidates"]}
        self.assertEqual("recommend", result["decision"])
        self.assertTrue(ids & {"buffering-spinner", "spanky-bored-waiting", "skeleton-waiting"})
        self.assertTrue(all("waiting" in item["functions"] for item in result["candidates"]))

    def test_plain_progress_language_does_not_fall_back_to_fame(self):
        result = self.choose("We are making steady progress", tone="upbeat", limit=3)
        self.assertIn("progress", result["inferred_intents"])
        self.assertTrue(all("progress" in item["functions"] for item in result["candidates"]))

    def test_generic_exit_prefers_a_visual_exit_over_rejection(self):
        result = self.choose("I'm out. Goodbye!", tone="playful", limit=1)
        self.assertEqual("homer-bush-hide", result["candidates"][0]["id"])

    def test_broken_computer_maps_to_frustration_or_failure(self):
        result = self.choose("The computer still will not work", tone="exasperated", limit=5)
        self.assertTrue({"frustration", "failure"} & result["inferred_intents"].keys())
        self.assertTrue(
            all(
                {"frustration", "failure"} & set(item["functions"])
                for item in result["candidates"]
            )
        )

    def test_spanish_choose_both_selects_why_not_both(self):
        result = self.choose("¿Elegimos una solución u otra? Mejor ambas", limit=3)
        self.assertEqual("choice-both", next(iter(result["inferred_intents"])))
        self.assertEqual("why-not-both", result["candidates"][0]["id"])

    def test_sensitive_context_returns_no_gif_in_english_and_spanish(self):
        for context in (
            "A colleague died; I need to send condolences",
            "Necesito responder a un pésame por una muerte",
        ):
            with self.subTest(context=context):
                result = self.choose(context)
                self.assertEqual("no_gif", result["decision"])
                self.assertEqual([], result["candidates"])

    def test_max_rating_is_a_hard_filter(self):
        result = self.choose("It works, great success", explicit_intents=["success"], limit=20)
        self.assertEqual("recommend", result["decision"])
        self.assertTrue(all(item["rating"] == "g" for item in result["candidates"]))
        self.assertNotIn("borat-great-success", {item["id"] for item in result["candidates"]})

    def test_no_people_is_a_hard_filter(self):
        result = self.choose("We did it!", explicit_intents=["celebration"], no_people=True, limit=20)
        self.assertEqual("recommend", result["decision"])
        self.assertTrue(all(not item["people"] for item in result["candidates"]))

    def test_current_and_iconic_filters_use_evidence_classes(self):
        current = self.choose("What a surprise", freshness="current", limit=20)
        iconic = self.choose("What a surprise", freshness="iconic", limit=20)
        self.assertEqual("recommend", current["decision"])
        self.assertEqual("recommend", iconic["decision"])
        self.assertTrue(all(item["is_current"] for item in current["candidates"]))
        self.assertTrue(all(item["is_iconic"] for item in iconic["candidates"]))

    def test_current_snapshot_expires_after_thirty_days(self):
        result = self.choose(
            "What a surprise",
            freshness="current",
            as_of=dt.date(2026, 9, 13),
            limit=20,
        )
        self.assertEqual("no_match", result["decision"])

    def test_unknown_audience_only_returns_explicitly_safe_unknowns(self):
        result = select_gif.select_gifs(
            catalog=self.catalog,
            context="Waiting",
            audience="unknown",
            as_of=self.as_of,
            limit=20,
        )
        self.assertEqual("recommend", result["decision"])
        self.assertTrue(all("unknown" in item["audiences"] for item in result["candidates"]))

    def test_markdown_has_link_alt_and_evidence(self):
        result = self.choose("Arrancamos a trabajar", explicit_intents=["work-start"], limit=1)
        output = select_gif.render_markdown(result)
        self.assertIn("Best fit: [", output)
        self.assertIn("https://giphy.com/gifs/", output)
        self.assertIn("Alt text:", output)
        self.assertIn("Evidence: `", output)

    def test_cli_validation_succeeds(self):
        completed = subprocess.run(
            [sys.executable, str(SCRIPT_DIR / "select_gif.py"), "--validate"],
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(0, completed.returncode, completed.stderr)
        self.assertIn("Catalog valid: 84 entries", completed.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
