---
name: choose-contextual-gif
description: Select, recommend, and optionally download an appropriate reaction GIF for a message, conversation, presentation, post, Slack or Discord reply, or work-chat moment. Use when Codex must map context to a funny, iconic, currently popular, or situation-specific GIF; compare GIF options; find a stable GIF permalink or search phrase; save a chosen catalog GIF locally with provenance; explain why a GIF fits; avoid an insensitive or stale reaction; or decide that no GIF is appropriate.
---

# Choose a Contextual GIF

Treat a GIF as a conversational reply, not as a literal illustration of the user's words. Optimize for the intended social effect and the recipient's likely interpretation. Prefer a precise, slightly less popular GIF over a famous but mismatched one.

## Workflow

1. Extract or infer this brief:
   - message or event being answered;
   - desired communicative function;
   - recipient and relationship;
   - channel and formality;
   - tone and humor level;
   - locale or cultural frame;
   - content-rating ceiling;
   - whether recency, iconicity, or novelty matters.
2. Apply the no-GIF gate before retrieval. Do not use a GIF for bereavement, trauma, serious illness, self-harm, harassment, abuse, layoffs, discipline, legal notices, emergencies, sincere high-stakes apologies, or similarly sensitive contexts. Prefer plain, empathetic text. Also recommend no GIF when the relationship, cultural meaning, or intended irony is too uncertain.
3. Name the response function before choosing imagery. Use one or two functions such as `work-start`, `busy`, `waiting`, `progress`, `success`, `celebration`, `approval`, `thanks`, `encouragement`, `surprise`, `confusion`, `skepticism`, `rejection`, `frustration`, `failure`, `chaos`, `anticipation`, `awkwardness`, `laughter`, `sadness`, `exit`, or `choice-both`.
4. Retrieve candidates from `references/gif-catalog.json` with `scripts/select_gif.py`. Pass explicit audience, tone, rating, and freshness filters when known.
5. Inspect the top candidates rather than accepting rank blindly. Check the visual action, any on-screen text, emotional transition, source character, possible stereotype, ambiguity, and the candidate's `avoid` note. Do not infer the GIF's meaning from its title alone.
6. If the user asks for a current or trending GIF, verify a live platform signal. Read the freshness rules in `references/selection-rubric.md`. State the platform, query or feed, region when known, and observation date. Never call a platform ranking a global "most-used" ranking.
7. Verify a permalink before delivering it when network access is available. Prefer the canonical GIPHY page over a direct `media*.giphy.com` rendition URL. Direct media URLs and provider ranks can change.
8. Return one best choice by default. Add at most two alternatives only when they express meaningfully different tones. Include accessible alt text.

## Run the Selector

From this skill directory:

```powershell
python scripts/select_gif.py "Starting a long work session" --intent work-start --audience team-chat --tone playful --max-rating g --limit 3 --format markdown
```

Useful controls:

- `--freshness current|iconic|any`
- `--humor 0..5`
- `--intensity 1..5`
- `--no-people`
- `--exclude id-a,id-b`
- `--allow-sensitive` only after human judgment establishes that a GIF is appropriate
- `--validate` to validate the catalog

Treat script scores as retrieval signals. Make the final social judgment yourself.
The built-in intent inference recognizes common English and Spanish phrases. Supply `--intent` explicitly for another language or an ambiguous message.

## Download a Chosen GIF

Download only after the user explicitly requests a local file and the intended use is permitted. Resolve the chosen catalog entry without writing first:

```powershell
python scripts/download_gif.py hamster-wheel-running --resolve-only
```

Then download it to an explicit directory inside the project:

```powershell
python scripts/download_gif.py hamster-wheel-running --output-dir output/gifs --confirm-rights
```

The script prefers the official Get GIF by ID endpoint when `GIPHY_API_KEY` is set. Without a key, `auto` reads the GIF URL from the canonical page's public metadata; that fallback supports only `original` and may stop working if the page changes. Use `--resolution api --rendition downsized` for a smaller API-provided rendition.

Keep the generated JSON sidecar: it records the canonical page, provider ID, rating, retrieval method, SHA-256 digest, byte count, alt text, and attribution reminder. The script rejects non-GIPHY redirects, non-GIF signatures, files over the configured limit, paths outside this repository, and existing files unless `--overwrite` is explicit. Never expose an API key in output or pass one on the command line.
After a successful download, return the local GIF path, sidecar path, canonical source page, and alt text to the user.

## Current and Iconic Claims

- Use `current` only for a signal observed within the last 30 days. Re-check it at answer time.
- Use `iconic` for durable cultural recognition supported by a historical canon, an annual platform list, or continued top placement for an exact contextual query.
- Use `context-rank` for a GIF observed near the top of one exact search phrase. Do not generalize that rank to other queries or platforms.
- Use `catalog` when no stronger popularity evidence exists. Describe it as a good contextual fit, not a popularity claim.
- Preserve the catalog's observation date and evidence class in any audit or research output.

## Output Contract

Use this compact shape unless the user requests something else:

```markdown
Best fit: [GIF label](canonical permalink)

Why: <one sentence connecting the message, social function, and tone>
Search: `<exact provider search phrase>`
Alt text: <literal description of the visible action and any text>
Caution: <only when there is a real ambiguity or audience risk>
Evidence: <iconic, current platform snapshot, or contextual search rank with date>
```

Do not embed or download copyrighted GIF files unless the user explicitly asks and the intended use permits it. Attribute the provider or creator where available. If integrating the GIPHY API, follow its attribution and analytics requirements.

## Resource Routing

- Read `references/gif-catalog.json` only through the selector for routine retrieval; inspect candidate records directly when making a close or sensitive choice.
- Read `references/selection-rubric.md` for ambiguous tone, workplace or cross-cultural use, recency research, provider integration, accessibility, safety, and catalog maintenance.
- Run `python scripts/test_select_gif.py` and `python scripts/test_download_gif.py` after changing the catalog or scripts.
