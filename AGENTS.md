# Overview
This repository stores technical blog content and supporting assets.

## Documentation Rules
- Write documentation in English.
- Include references when they add useful context or attribution.

## Knowledge Workflow
- Read `knowledge/catalog.json` before researching a post.
- Use `.agents/skills/consult-expert-knowledge/SKILL.md` for software-engineering and data-science research.
- Treat `knowledge/expert-sources/` and `.know/` as immutable, private, ignored inputs.
- Never commit, publish, attach, or copy private corpus text into a tracked path.
- Retrieval rankings are discovery signals; verify claims against returned authoritative text, identities, locators, and hashes.

### Initialize the private domains

Run this once after cloning the blog, after rebuilding either private corpus, or when
`.know/` or `knowledge/expert-sources/` is absent:

```powershell
npm run knowledge:bootstrap
```

The bootstrap command creates two project-local knowledge domains:

- `software-engineering`: 18 private PDF books, queried with classical fusion.
- `data-science`: 38 private EPUB books across the `ds` and `ai-ml` source partitions,
  queried with ensemble fast retrieval.

Inspect the local registry from the repository root or any descendant directory:

```powershell
know list keys
know list sources --key software-engineering
know list sources --key data-science
```

If the installed `know` predates project-local `.know` discovery, use
`know --store ./.know ...` until the CLI is upgraded.

### Validate and query the domains

After bootstrap or a corpus refresh, validate both immutable bundles deeply:

```powershell
./scripts/query-expert.ps1 -Domain software-engineering -Inspect -DeepValidation
./scripts/query-expert.ps1 -Domain data-science -Inspect -DeepValidation
```

Research with a complete question rather than keywords:

```powershell
./scripts/query-expert.ps1 -Domain software-engineering -Query "How should service boundaries respond to volatility?" -TopK 10
./scripts/query-expert.ps1 -Domain data-science -Query "What failure modes recur in production ML pipelines?" -TopK 10
```

Open the returned authoritative concept or source path before using a claim. Preserve
the returned source identity, locator, and hash in research notes. Do not treat a
ranking score, topic, entity, association, or graph edge as evidence by itself.

## Content Workflow
- Store posts as Markdown under `src/content/posts/`.
- Keep incomplete or unverified work marked `draft: true`.
- Synthesize multiple sources, preserve disagreements, and verify time-sensitive claims against current primary sources.
- Run `npm run validate` before publishing.

## Decision Records
- Record durable technical or workflow decisions as ADRs under `.specs/adr/*.md`.
- Read existing ADRs before changing a previously chosen technical direction.

## Update Access Scope

- Writable project root: `C:\Users\villa\dev\blog`.
- Agents may create, modify, move, or delete files only inside this root and its descendants when the task requires it.
- Treat paths outside this root as read-only unless the user explicitly authorizes a broader scope.
- A reference to another repository or shared tool does not grant write access to it.

## Output

- Blogs will be deployed via github pages using astro latest version via static content
- A new version also will be stored as html in `C:\Users\villa\projects\blog\$TIMESTAMP`
- final version should try to ensure correct display of diagrams (mermaid, d3, echart, plantuml and so)

## Constrains

- Use internal skills to polish everything before pusblish it

## Repository organization and documentation

- Keep `README.md` as an overview: purpose, critical boundaries, first useful action, and links into `docs/README.md`.
- Put detailed procedures and reference material in `docs/`; update its index with every addition or move.
- Follow the [repository guide](docs/repository-guide.md) for file placement, validation, and data boundaries.
- Preserve existing canonical specs, ADRs, skill bundles, and evidence paths; do not reorganize sealed or generated data as documentation.
- Preserve prior work, stage explicit paths, and verify links, relevant checks, and the diff before an authorized push.
- Build tools must not delete authored documentation. Keep transient output and credentials outside tracked source.
