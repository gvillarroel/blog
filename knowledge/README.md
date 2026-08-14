# Local knowledge

This directory defines the private, agent-facing evidence layer used to research blog
posts. The catalog is public; the corpora, extracted text, indexes, and local `know`
registry are not.

## Public research domains

Public paper collections are documented under `knowledge/public/` while their
downloaded PDFs, extracted text, exports, and indexes remain in ignored `.know/`
storage. The current domains are:

- `agent-harnesses`, `agent-skills`, and `agent-context`, documented in
  [`public/agent-systems/`](public/agent-systems/README.md);
- `graphs-and-ai`, a 114-source graph theory, graph ML, knowledge graph,
  GraphRAG, and graph-reasoning collection documented in
  [`public/graphs-and-ai/`](public/graphs-and-ai/README.md).

Utility-first reading tables with a separate direct-PDF column are available
for [harnesses](public/agent-systems/harnesses-index.md),
[skills](public/agent-systems/skills-index.md),
[context](public/agent-systems/context-index.md), and
[Graphs and AI](public/graphs-and-ai/index.md).

Rebuild the Graphs and AI domain with:

```powershell
npm run knowledge:graphs-and-ai
npm run knowledge:indexes
```

## Bootstrap

From the repository root, run:

```powershell
npm run knowledge:bootstrap
```

The command validates the expected sibling `../knowledge` checkout, creates local
junctions under the ignored `knowledge/expert-sources/` directory, initializes the
project-local ignored `.know/` store, and registers one `know` key plus one Television
source definition for each domain. It never edits the source repository or copies
private text into a tracked path.

From anywhere inside this repository, an up-to-date `know` CLI discovers `.know`
automatically:

```powershell
know list keys
know list sources --key software-engineering
know list sources --key data-science
```

For compatibility with an older installed CLI, pass the store explicitly:

```powershell
know --store ./.know list keys
```

The two expert profiles intentionally use different retrieval policies because the
frozen benchmarks select different winners:

| Domain | Corpus | Policy | Recall@10 | nDCG@10 |
| --- | ---: | --- | ---: | ---: |
| Software engineering | 18 books | Classical fusion | 97.29% | 92.58% |
| Data science, AI, and ML | 38 books | Ensemble fast | 99.17% | 94.44% |

## Query

```powershell
./scripts/query-expert.ps1 -Domain software-engineering -Query "How should service boundaries respond to volatility?"

./scripts/query-expert.ps1 -Domain data-science -Query "What failure modes recur in production ML pipelines?"
```

Run `-Inspect -DeepValidation` once after a source bundle changes. Retrieval rankings
are discovery signals, not evidence. Before using a result in a post, open its returned
authoritative concept or source path and verify the exact locator and text hash.

## Privacy boundary

Never commit, publish, quote at length, or attach private source text. A post may contain
original synthesis and short, legally appropriate quotations, but its claims must remain
traceable to source identities and locators. `npm run verify:build` fails if an expert
source path becomes tracked.
