# Local expert knowledge

This directory defines the private, agent-facing evidence layer used to research blog
posts. The catalog is public; the corpora, extracted text, indexes, and local `know`
registry are not.

## Bootstrap

From the repository root, run:

```powershell
npm run knowledge:bootstrap
```

The command validates the expected sibling `../knowledge` checkout, creates local
junctions under the ignored `knowledge/expert-sources/` directory, and registers one
`know` key and one Television source definition for each domain. It never edits the
source repository or copies private text into a tracked path.

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
