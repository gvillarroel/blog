# Technical Notes: repository guide

An Astro technical blog that turns evidence-based research into public Markdown posts with Mermaid, D3, ECharts, and PlantUML diagrams. Private expert corpora are inputs to research and never part of the published website.

## Layout

| Path | Responsibility |
| --- | --- |
| `src/content/posts/` | Public posts and explicitly marked local drafts. |
| `src/content/templates/` | Authoring templates outside the published content collection. |
| `src/` | Astro pages, layouts, styles, and diagram rendering. |
| `knowledge/` | Tracked source catalog and operating instructions; expert bundles remain private. |
| `scripts/` | Validation, knowledge setup, and archival tools. |
| `.specs/adr/` | Durable publishing and research decisions. |

## Documentation policy

- Keep the root `README.md` focused on purpose, critical constraints, and the first useful action. Put detailed procedures in `docs/`.
- Maintain `docs/README.md` as the navigation index whenever a guide is added or moved.
- Preserve existing specification, ADR, skill-contract, and evidence locations. Link to their owners instead of copying authoritative content.
- Keep implementation, configuration, source data, and generated output separate. Do not create empty folder hierarchies without a concrete need.
- Use portable relative links. Update both outgoing links and inbound references when moving a document.
- Document prerequisites, commands, expected outcomes, and limitations. Never describe an unrun check as verified.

## Change workflow

1. Read `AGENTS.md`, this index, and the relevant source contract.
2. Inspect `git status` and preserve pre-existing changes and staged files.
3. Make a focused change and update affected documentation in the same change.
4. Run the applicable checks below, inspect the diff, and record any unavailable prerequisite.
5. Stage explicit paths. Publish only when authorized; do not force-push or merge unrelated work.

## Validation

```sh
npm run validate
```

This runs the Astro checks, tests, build, and publication/privacy checks. Review rendered diagrams when post or renderer content changes.

## Data and operating boundaries

Never commit `.know/`, private expert bundles, PDF/EPUB corpora, authentication files, or unpublished research exports. Use source identities and locators in research notes without copying private corpus text into tracked output.

[Back to the documentation index](README.md).
