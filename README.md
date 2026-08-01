# Technical Notes

An Astro-powered technical blog built around a strict separation between private
expert research material and public, evidence-grounded Markdown posts.

## Repository map

```text
src/content/posts/        Publishable Markdown and local drafts
src/content/templates/    Authoring templates outside the content collection
src/pages/                Static routes, RSS, and the post renderer
src/remark/               Diagram fence transformation
knowledge/                Tracked catalog and private-source operating guide
knowledge/expert-sources/ Ignored local expert bundles
.agents/skills/           Agent workflow for evidence-grounded consultation
.specs/adr/               Durable technical and workflow decisions
scripts/                  Knowledge, validation, and archive automation
```

## Develop and validate

Node.js 24 or later and Java 17 or later are required. Java renders PlantUML to
self-contained SVG during the build; diagram source is not sent to an external service.

```powershell
npm install
npm run dev
npm run validate
```

`validate` type-checks the Astro project, tests diagram transformation, produces the
static build, verifies the GitHub Pages base path, confirms drafts stay private, and
fails if any expert corpus, PDF, or EPUB becomes tracked.

## Author a post

Copy `src/content/templates/post.md` into `src/content/posts/` and give it a stable,
descriptive slug. Posts remain ordinary Markdown. Fenced `mermaid`, `echarts`, `d3`,
and `plantuml` blocks render as diagrams; each retains its source as a fallback.

A post is ready when it:

- states a concrete question and a qualified conclusion;
- synthesizes multiple sources instead of paraphrasing one source;
- distinguishes evidence, interpretation, and recommendation;
- includes trade-offs, failure modes, and changing conditions;
- cites primary or authoritative references for consequential and current claims; and
- has `draft: false` only after `npm run validate` and visual review pass.

## Expert knowledge

The first two local expert sources cover software engineering and data science. Their
private content is never part of Git or the site build.

```powershell
npm run knowledge:bootstrap
./scripts/query-expert.ps1 -Domain software-engineering -Query "FULL QUESTION"
./scripts/query-expert.ps1 -Domain data-science -Query "FULL QUESTION"
```

See [`knowledge/README.md`](knowledge/README.md) for retrieval policies, validation,
and the privacy boundary.

## Publish and archive

Pushes to `main` run the official Astro GitHub Pages workflow. Private repositories
are still validated and built, but deployment is skipped because Pages is not enabled
for this repository's current plan. Once the repository can use Pages, select
**GitHub Actions** as its publishing source and rerun the workflow.

After a validated build, create the required timestamped local HTML snapshot with:

```powershell
npm run archive
```

The default archive root is `C:\Users\villa\projects\blog`. The script creates a new
UTC timestamp directory and never overwrites an existing snapshot.
