#!/usr/bin/env python3
"""Deterministically retrieve context-appropriate GIFs from the local catalog."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urlparse


CATALOG_PATH = Path(__file__).resolve().parents[1] / "references" / "gif-catalog.json"
RATING_ORDER = {"g": 0, "pg": 1, "pg-13": 2, "r": 3}
AUDIENCES = {"friends", "team-chat", "public-social", "formal-work", "unknown"}
EVIDENCE_CLASSES = {"catalog", "context-rank", "current-snapshot", "iconic"}

# Phrases are intentionally bilingual. Add precise phrases instead of broad words
# that would make unrelated messages look equivalent.
INTENT_PATTERNS: dict[str, tuple[str, ...]] = {
    "work-start": (
        "start work", "starting work", "begin work", "kick off", "get to work",
        "work session", "back to work", "manos a la obra", "a trabajar",
        "empezar a trabajar", "empiezo a trabajar", "iniciar trabajo",
        "arrancar", "arrancamos", "comenzamos", "empezamos",
    ),
    "busy": (
        "busy", "swamped", "full plate", "heads down", "working hard",
        "ocupado", "ocupada", "ocupadisimo", "saturado", "a tope", "mucho trabajo",
    ),
    "loading": (
        "loading", "buffering", "processing", "cargando", "procesando", "compilando",
    ),
    "waiting": (
        "waiting", "still waiting", "wait for", "pending", "esperando", "en espera",
        "todavia no", "aun no", "paciencia",
    ),
    "deadline": (
        "deadline", "due date", "time is running out", "against the clock",
        "plazo", "fecha limite", "contra reloj", "entrega hoy",
    ),
    "progress": (
        "progress", "in progress", "making progress", "work in progress", "underway",
        "progreso", "avanzando", "en progreso", "en curso", "ya va", "seguimos trabajando",
    ),
    "success": (
        "it works", "fixed it", "done", "passed", "success", "solved",
        "funciona", "arreglado", "resuelto", "listo", "salio bien", "paso el test",
    ),
    "bug-fixed": ("bug fixed", "fix landed", "error fixed", "bug arreglado", "fallo resuelto"),
    "test-pass": ("tests pass", "test passed", "green build", "tests verdes", "pruebas pasan"),
    "ship": ("ship it", "shipped", "shipping", "enviado", "a produccion", "lanzado"),
    "deploy": ("deploy", "deployed", "deployment", "desplegar", "desplegado", "publicar"),
    "release": ("release", "released", "launch", "lanzamiento", "nueva version"),
    "celebration": (
        "celebrate", "celebration", "we did it", "party", "brindis",
        "celebrar", "celebracion", "lo logramos", "fiesta",
    ),
    "approval": (
        "approved", "looks good", "good to go", "okay", "ok", "yes",
        "aprobado", "se ve bien", "dale", "de acuerdo", "perfecto",
    ),
    "agreement": ("i agree", "exactly", "same", "coincido", "exacto", "tal cual"),
    "thanks": ("thank you", "thanks", "much appreciated", "gracias", "te agradezco"),
    "gratitude": ("grateful", "gratitude", "agradecido", "agradecida"),
    "encouragement": (
        "you got this", "keep going", "good luck", "believe in you",
        "tu puedes", "vamos", "animo", "sigue asi", "buena suerte",
    ),
    "praise": ("great job", "well done", "nice work", "buen trabajo", "bien hecho", "excelente trabajo"),
    "surprise": ("surprised", "no way", "what", "wow", "sorpresa", "no puede ser"),
    "shock": ("shocked", "speechless", "impactado", "en shock", "sin palabras"),
    "confusion": (
        "confused", "i don't understand", "what is happening", "lost",
        "confundido", "confundida", "no entiendo", "que pasa", "que significa",
    ),
    "skepticism": (
        "skeptical", "doubt", "not convinced", "really", "sure about that",
        "esceptico", "duda", "no me convence", "en serio", "seguro",
    ),
    "rejection": ("nope", "hard no", "absolutely not", "rechazado", "ni hablar", "definitivamente no"),
    "disagreement": ("disagree", "not true", "no estoy de acuerdo", "eso no"),
    "frustration": (
        "frustrated", "annoyed", "why won't", "won't work", "will not work", "not working", "ugh", "fed up",
        "frustrado", "frustrada", "molesto", "harto", "no funciona",
    ),
    "failure": (
        "failed", "failure", "broke", "broken", "didn't work", "will not work",
        "fallo", "fracaso", "se rompio", "no funciona", "no salio",
    ),
    "chaos": (
        "chaos", "everything is on fire", "out of control", "incident",
        "caos", "todo arde", "fuera de control", "incidente",
    ),
    "anticipation": ("can't wait", "anticipation", "soon", "que ganas", "ya casi", "se viene"),
    "awkwardness": ("awkward", "uncomfortable", "silence", "incomodo", "incomoda", "silencio incomodo"),
    "laughter": ("laugh", "funny", "hilarious", "lol", "lmao", "risa", "gracioso", "jajaja", "me rio"),
    "sadness": ("sad", "disappointed", "crying", "triste", "decepcionado", "llorando"),
    "exit": ("leaving", "i'm out", "goodbye", "bye", "me voy", "salgo", "adios", "hasta luego"),
    "choice-both": (
        "why not both", "both", "choose both", "porque no los dos", "por que no ambos",
        "los dos", "ambos", "ambas", "las dos",
    ),
    "facepalm": ("facepalm", "can't believe this", "palmada en la cara", "no me lo puedo creer"),
    "eye-roll": ("eye roll", "rolling eyes", "poner los ojos en blanco"),
    "mind-blown": ("mind blown", "mindblown", "cabeza explota", "me volo la cabeza"),
    "mic-drop": ("mic drop", "final word", "soltar el microfono", "fin de la discusion"),
    "applause": ("applause", "clap", "standing ovation", "aplausos", "ovacion"),
    "welcome": ("welcome", "glad you're here", "bienvenido", "bienvenida", "que bueno tenerte"),
    "morning": ("good morning", "morning", "buenos dias", "buen dia"),
    "friday": ("friday", "weekend", "viernes", "fin de semana"),
    "overtime": ("overtime", "working late", "all nighter", "horas extra", "trabajar tarde", "toda la noche"),
    "multitasking": ("multitasking", "many things at once", "multitarea", "mil cosas"),
    "teamwork": ("teamwork", "team effort", "together", "trabajo en equipo", "juntos", "juntas"),
    "debugging": ("debugging", "debug", "trace the bug", "depurando", "buscar el bug", "investigando el error"),
    "thinking": ("thinking", "let me think", "pensando", "dejame pensar"),
    "overthinking": ("overthinking", "thinking too much", "sobrepensando", "darle demasiadas vueltas"),
    "panic": ("panic", "panicking", "panico", "entrando en panico"),
    "calm": ("calm down", "deep breath", "stay calm", "respira", "calma", "tranquilo", "tranquila"),
}

SENSITIVE_PATTERNS = (
    "death", "died", "dying", "funeral", "grief", "condolence", "bereavement",
    "cancer", "terminal illness", "suicide", "self harm", "layoff", "laid off",
    "fired", "termination", "harassment", "assault", "abuse", "emergency",
    "legal notice", "disciplinary", "diagnosis", "miscarriage", "trauma",
    "muerte", "murio", "fallecio", "funeral", "duelo", "pesame", "cancer",
    "enfermedad terminal", "suicidio", "autolesion", "despido", "despedido",
    "despedida laboral", "acoso", "agresion", "abuso", "emergencia",
    "notificacion legal", "medida disciplinaria", "diagnostico", "aborto espontaneo",
)

STOPWORDS = {
    "a", "al", "an", "and", "are", "as", "at", "be", "de", "del", "el", "en",
    "for", "from", "i", "in", "is", "it", "la", "las", "lo", "los", "me",
    "mi", "of", "on", "or", "para", "por", "que", "the", "this", "to", "un",
    "una", "we", "with", "y", "ya", "yo",
}


def normalize(value: str) -> str:
    """Return lowercase, accent-free text with stable whitespace."""
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    without_marks = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return " ".join(re.findall(r"[a-z0-9]+", without_marks))


def tokens(value: str) -> set[str]:
    return {token for token in normalize(value).split() if len(token) > 1 and token not in STOPWORDS}


def phrase_present(text: str, phrase: str) -> bool:
    haystack = f" {normalize(text)} "
    needle = f" {normalize(phrase)} "
    return needle in haystack


def split_values(values: Iterable[str] | None) -> list[str]:
    result: list[str] = []
    for value in values or []:
        result.extend(item.strip() for item in value.split(",") if item.strip())
    return result


def infer_intents(context: str) -> dict[str, list[str]]:
    matches: dict[str, list[str]] = {}
    for intent, patterns in INTENT_PATTERNS.items():
        found = [pattern for pattern in patterns if phrase_present(context, pattern)]
        if found:
            matches[intent] = found
    return matches


def detect_sensitive(context: str) -> list[str]:
    return [pattern for pattern in SENSITIVE_PATTERNS if phrase_present(context, pattern)]


def parse_iso_date(value: str) -> dt.date:
    return dt.date.fromisoformat(value)


def evidence_date(evidence: str) -> dt.date | None:
    tail = evidence.rsplit("|", 1)[-1]
    try:
        return parse_iso_date(tail)
    except ValueError:
        return None


def is_current(entry: dict[str, Any], as_of: dt.date) -> bool:
    for evidence in entry["evidence"]:
        if evidence.startswith("current-snapshot|"):
            observed = evidence_date(evidence)
            if observed and dt.timedelta(0) <= as_of - observed <= dt.timedelta(days=30):
                return True
    return False


def is_iconic(entry: dict[str, Any]) -> bool:
    return any(item.startswith("iconic|") for item in entry["evidence"])


def evidence_label(entry: dict[str, Any], as_of: dt.date) -> str:
    evidence = entry["evidence"]
    current = [item for item in evidence if item.startswith("current-snapshot|") and is_current(entry, as_of)]
    iconic = [item for item in evidence if item.startswith("iconic|")]
    contextual = [item for item in evidence if item.startswith("context-rank|")]
    return (current or iconic or contextual or evidence)[0]


def load_catalog(path: Path = CATALOG_PATH) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_catalog(catalog: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    required_top = {"schema_version", "updated_at", "default_provider", "claim_policy", "sources", "entries"}
    missing_top = required_top - catalog.keys()
    if missing_top:
        errors.append(f"catalog: missing top-level fields: {', '.join(sorted(missing_top))}")
        return errors
    if catalog["schema_version"] != 1:
        errors.append("catalog: schema_version must be 1")
    try:
        updated_at = parse_iso_date(catalog["updated_at"])
    except (TypeError, ValueError):
        updated_at = None
        errors.append("catalog: updated_at must be an ISO date")
    if not isinstance(catalog["sources"], list) or not catalog["sources"]:
        errors.append("catalog: sources must be a non-empty list")
    else:
        source_ids: set[str] = set()
        for index, source in enumerate(catalog["sources"]):
            prefix = f"sources[{index}]"
            if not isinstance(source, dict):
                errors.append(f"{prefix}: must be an object")
                continue
            for field in ("id", "url", "checked_at", "scope"):
                if not isinstance(source.get(field), str) or not source[field].strip():
                    errors.append(f"{prefix}: {field} must be a non-empty string")
            source_id = source.get("id")
            if source_id in source_ids:
                errors.append(f"{prefix}: duplicate source id {source_id!r}")
            if isinstance(source_id, str):
                source_ids.add(source_id)
            if isinstance(source.get("url"), str) and urlparse(source["url"]).scheme != "https":
                errors.append(f"{prefix}: url must use HTTPS")
            try:
                checked_at = parse_iso_date(source.get("checked_at", ""))
                if updated_at and checked_at > updated_at:
                    errors.append(f"{prefix}: checked_at is later than catalog updated_at")
            except ValueError:
                errors.append(f"{prefix}: checked_at must be an ISO date")

    entries = catalog["entries"]
    if not isinstance(entries, list) or not entries:
        errors.append("catalog: entries must be a non-empty list")
        return errors

    required_entry = {
        "id", "label", "provider_id", "url", "alt", "functions", "tones",
        "audiences", "rating", "humor", "intensity", "people", "use", "avoid",
        "search", "evidence",
    }
    seen: dict[str, set[str]] = {"id": set(), "provider_id": set(), "url": set()}
    for index, entry in enumerate(entries):
        prefix = f"entries[{index}]"
        if not isinstance(entry, dict):
            errors.append(f"{prefix}: must be an object")
            continue
        missing = required_entry - entry.keys()
        if missing:
            errors.append(f"{prefix}: missing fields: {', '.join(sorted(missing))}")
            continue
        entry_id = entry["id"]
        if not isinstance(entry_id, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", entry_id):
            errors.append(f"{prefix}: id must be lowercase kebab-case")
        for field in ("id", "provider_id", "url"):
            value = entry[field]
            if value in seen[field]:
                errors.append(f"{prefix}: duplicate {field} {value!r}")
            seen[field].add(value)
        for field in ("label", "provider_id", "url", "alt", "use", "avoid", "search"):
            if not isinstance(entry[field], str) or not entry[field].strip():
                errors.append(f"{prefix}: {field} must be a non-empty string")
        parsed = urlparse(entry["url"])
        if parsed.scheme != "https" or parsed.netloc.casefold() not in {"giphy.com", "www.giphy.com"}:
            errors.append(f"{prefix}: url must be a canonical HTTPS GIPHY page")
        if isinstance(entry["provider_id"], str) and entry["provider_id"] not in parsed.path:
            errors.append(f"{prefix}: provider_id must occur in url path")
        for field in ("functions", "tones", "audiences", "evidence"):
            values = entry[field]
            if not isinstance(values, list) or not values or not all(isinstance(item, str) and item.strip() for item in values):
                errors.append(f"{prefix}: {field} must be a non-empty string list")
            elif len(values) != len(set(values)):
                errors.append(f"{prefix}: {field} contains duplicates")
        invalid_audiences = set(entry["audiences"]) - AUDIENCES if isinstance(entry["audiences"], list) else set()
        if invalid_audiences:
            errors.append(f"{prefix}: invalid audiences: {', '.join(sorted(invalid_audiences))}")
        if entry["rating"] not in RATING_ORDER:
            errors.append(f"{prefix}: invalid rating {entry['rating']!r}")
        if not isinstance(entry["humor"], int) or isinstance(entry["humor"], bool) or not 0 <= entry["humor"] <= 5:
            errors.append(f"{prefix}: humor must be an integer from 0 to 5")
        if not isinstance(entry["intensity"], int) or isinstance(entry["intensity"], bool) or not 1 <= entry["intensity"] <= 5:
            errors.append(f"{prefix}: intensity must be an integer from 1 to 5")
        if not isinstance(entry["people"], bool):
            errors.append(f"{prefix}: people must be boolean")
        for evidence in entry["evidence"] if isinstance(entry["evidence"], list) else []:
            evidence_class = evidence.split("|", 1)[0]
            if evidence_class not in EVIDENCE_CLASSES:
                errors.append(f"{prefix}: unknown evidence class in {evidence!r}")
            parts = evidence.split("|")
            if evidence_class in {"context-rank", "current-snapshot"}:
                if len(parts) != 5:
                    errors.append(f"{prefix}: malformed ranked evidence {evidence!r}")
                else:
                    try:
                        if int(parts[3]) < 1:
                            raise ValueError
                    except ValueError:
                        errors.append(f"{prefix}: evidence rank must be a positive integer in {evidence!r}")
                    try:
                        observed = parse_iso_date(parts[4])
                        if updated_at and observed > updated_at:
                            errors.append(f"{prefix}: evidence date is later than catalog updated_at")
                    except ValueError:
                        errors.append(f"{prefix}: evidence date must be ISO in {evidence!r}")
            elif evidence_class == "iconic" and len(parts) < 3:
                errors.append(f"{prefix}: malformed iconic evidence {evidence!r}")
    return errors


def score_entry(
    entry: dict[str, Any],
    context: str,
    explicit_intents: set[str],
    inferred: dict[str, list[str]],
    tone: str | None,
    audience: str,
    humor: int | None,
    intensity: int | None,
    freshness: str,
    as_of: dt.date,
) -> tuple[float, list[str]]:
    score = 0.0
    reasons: list[str] = []
    functions = set(entry["functions"])
    explicit_hits = sorted(functions & explicit_intents)
    inferred_hits = sorted(functions & inferred.keys())
    if explicit_hits:
        points = 12.0 + 3.0 * (len(explicit_hits) - 1)
        score += points
        reasons.append(f"explicit function: {', '.join(explicit_hits)}")
    if inferred_hits:
        points = 9.0 + 2.0 * (len(inferred_hits) - 1)
        score += points
        reasons.append(f"inferred function: {', '.join(inferred_hits)}")

    context_tokens = tokens(context)
    searchable = " ".join(
        [entry["label"], entry["alt"], entry["use"], entry["search"]]
        + entry["functions"]
        + entry["tones"]
    )
    overlaps = sorted(context_tokens & tokens(searchable))
    if overlaps:
        points = min(5.0, 1.25 * len(overlaps))
        score += points
        reasons.append(f"context terms: {', '.join(overlaps[:5])}")

    normalized_tone = normalize(tone or "").replace(" ", "-")
    if normalized_tone and normalized_tone in {normalize(value).replace(" ", "-") for value in entry["tones"]}:
        score += 4.0
        reasons.append(f"tone: {tone}")
    if audience in entry["audiences"]:
        score += 2.5
        reasons.append(f"audience: {audience}")
    if humor is not None:
        points = max(0.0, 3.0 - 0.75 * abs(humor - entry["humor"]))
        score += points
        reasons.append(f"humor distance: {abs(humor - entry['humor'])}")
    if intensity is not None:
        points = max(0.0, 3.0 - 0.75 * abs(intensity - entry["intensity"]))
        score += points
        reasons.append(f"intensity distance: {abs(intensity - entry['intensity'])}")
    if freshness == "current" and is_current(entry, as_of):
        score += 4.0
        reasons.append("fresh current snapshot")
    elif freshness == "iconic" and is_iconic(entry):
        score += 4.0
        reasons.append("iconic evidence")
    elif freshness == "any":
        if is_current(entry, as_of):
            score += 0.75
        if is_iconic(entry):
            score += 0.5
    if entry["rating"] == "g":
        score += 0.25
    return score, reasons


def select_gifs(
    catalog: dict[str, Any],
    context: str,
    explicit_intents: Iterable[str] = (),
    tone: str | None = None,
    audience: str = "unknown",
    max_rating: str = "g",
    freshness: str = "any",
    humor: int | None = None,
    intensity: int | None = None,
    no_people: bool = False,
    exclude: Iterable[str] = (),
    limit: int = 3,
    allow_sensitive: bool = False,
    as_of: dt.date | None = None,
) -> dict[str, Any]:
    as_of = as_of or dt.date.today()
    sensitive_matches = detect_sensitive(context)
    inferred = infer_intents(context)
    explicit = {normalize(item).replace(" ", "-") for item in explicit_intents}
    excluded = set(exclude)

    if sensitive_matches and not allow_sensitive:
        return {
            "decision": "no_gif",
            "reason": "The context appears sensitive; use direct, empathetic text instead of a reaction GIF.",
            "matched_safety_terms": sensitive_matches,
            "suggested_text": "Acknowledge what happened plainly, express care, and offer concrete help if appropriate.",
            "candidates": [],
        }

    ranked: list[dict[str, Any]] = []
    for entry in catalog["entries"]:
        if entry["id"] in excluded:
            continue
        if RATING_ORDER[entry["rating"]] > RATING_ORDER[max_rating]:
            continue
        if audience not in entry["audiences"]:
            continue
        if no_people and entry["people"]:
            continue
        if freshness == "current" and not is_current(entry, as_of):
            continue
        if freshness == "iconic" and not is_iconic(entry):
            continue
        score, reasons = score_entry(
            entry, context, explicit, inferred, tone, audience, humor, intensity, freshness, as_of
        )
        # If intent is known, require a function match. This prevents fame from
        # overwhelming semantics; explicit filters remain retrieval constraints.
        known_intents = explicit | set(inferred)
        if known_intents and not (set(entry["functions"]) & known_intents):
            continue
        ranked.append(
            {
                **entry,
                "score": round(score, 2),
                "match_reasons": reasons,
                "evidence_summary": evidence_label(entry, as_of),
                "is_current": is_current(entry, as_of),
                "is_iconic": is_iconic(entry),
            }
        )
    ranked.sort(key=lambda item: (-item["score"], item["id"]))
    candidates = ranked[:limit]
    return {
        "decision": "recommend" if candidates else "no_match",
        "context": context,
        "explicit_intents": sorted(explicit),
        "inferred_intents": inferred,
        "filters": {
            "tone": tone,
            "audience": audience,
            "max_rating": max_rating,
            "freshness": freshness,
            "humor": humor,
            "intensity": intensity,
            "no_people": no_people,
            "as_of": as_of.isoformat(),
        },
        "candidates": candidates,
        "reason": None if candidates else "No catalog entry satisfies all filters and the inferred response function.",
    }


def render_markdown(result: dict[str, Any]) -> str:
    if result["decision"] == "no_gif":
        terms = ", ".join(result["matched_safety_terms"])
        return "\n".join(
            [
                "Decision: **No GIF**",
                "",
                f"Why: {result['reason']}",
                f"Safety signal: `{terms}`",
                f"Suggested response: {result['suggested_text']}",
            ]
        )
    if result["decision"] == "no_match":
        return f"Decision: **No catalog match**\n\nWhy: {result['reason']}"
    blocks: list[str] = []
    for index, entry in enumerate(result["candidates"], start=1):
        heading = "Best fit" if index == 1 else f"Alternative {index - 1}"
        reasons = "; ".join(entry["match_reasons"][:4]) or "catalog text similarity"
        block = [
            f"{heading}: [{entry['label']}]({entry['url']})",
            "",
            f"Why: {entry['use']} Match: {reasons}. Score: {entry['score']:.2f}.",
            f"Search: `{entry['search']}`",
            f"Alt text: {entry['alt']}",
        ]
        if entry["avoid"]:
            block.append(f"Caution: {entry['avoid']}")
        block.append(f"Evidence: `{entry['evidence_summary']}`")
        blocks.append("\n".join(block))
    return "\n\n---\n\n".join(blocks)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Select context-appropriate GIFs from the curated local catalog."
    )
    parser.add_argument("context", nargs="?", default="", help="Message or situation the GIF should answer")
    parser.add_argument("--intent", action="append", default=[], help="Function(s), repeat or comma-separate")
    parser.add_argument("--tone", help="Desired tone, for example playful, dry, warm, or sincere")
    parser.add_argument("--audience", choices=sorted(AUDIENCES), default="unknown")
    parser.add_argument("--max-rating", choices=list(RATING_ORDER), default="g")
    parser.add_argument("--freshness", choices=("any", "current", "iconic"), default="any")
    parser.add_argument("--humor", type=int, choices=range(0, 6))
    parser.add_argument("--intensity", type=int, choices=range(1, 6))
    parser.add_argument("--no-people", action="store_true", help="Exclude GIFs depicting people")
    parser.add_argument("--exclude", action="append", default=[], help="Catalog IDs to omit")
    parser.add_argument("--limit", type=int, default=3)
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    parser.add_argument("--allow-sensitive", action="store_true", help="Bypass safety gate after human review")
    parser.add_argument("--as-of", type=parse_iso_date, help="Date for reproducible freshness checks (YYYY-MM-DD)")
    parser.add_argument("--list-intents", action="store_true", help="List functions represented in the catalog")
    parser.add_argument("--validate", action="store_true", help="Validate the catalog and exit")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    catalog = load_catalog()
    errors = validate_catalog(catalog)
    if args.validate:
        if errors:
            print("Catalog validation failed:", file=sys.stderr)
            for error in errors:
                print(f"- {error}", file=sys.stderr)
            return 1
        print(f"Catalog valid: {len(catalog['entries'])} entries; updated {catalog['updated_at']}.")
        return 0
    if errors:
        parser.error("catalog is invalid; run with --validate for details")
    if args.list_intents:
        print("\n".join(sorted({item for entry in catalog["entries"] for item in entry["functions"]})))
        return 0
    if not args.context.strip():
        parser.error("context is required unless --validate or --list-intents is used")
    if args.limit < 1 or args.limit > 20:
        parser.error("--limit must be between 1 and 20")

    result = select_gifs(
        catalog=catalog,
        context=args.context,
        explicit_intents=split_values(args.intent),
        tone=args.tone,
        audience=args.audience,
        max_rating=args.max_rating,
        freshness=args.freshness,
        humor=args.humor,
        intensity=args.intensity,
        no_people=args.no_people,
        exclude=split_values(args.exclude),
        limit=args.limit,
        allow_sensitive=args.allow_sensitive,
        as_of=args.as_of,
    )
    if args.format == "json":
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(render_markdown(result))
    return 0 if result["decision"] in {"recommend", "no_gif"} else 2


if __name__ == "__main__":
    raise SystemExit(main())
