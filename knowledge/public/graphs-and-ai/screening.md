# Screening protocol for Graphs and AI

## Snapshot and bounded coverage

- **Cutoff:** 2026-08-14 23:59:59 UTC.
- **Current-year window:** papers first submitted during 2026 through the
  cutoff. Later revisions are not silently treated as new papers.
- **Retained:** 109 papers, including 39 from 2026 and 70 earlier anchors,
  plus five maintained primary web references.
- **Unit of inclusion:** one canonical, unversioned arXiv identifier.

“All 2026 papers” is not a defensible literal claim for the whole graph-learning
field: a broad GNN query returns thousands of narrow applications and changes
daily. Here it means all papers retained after screening the reproducible query
families below, plus citation chaining for foundational work. This bounds both
recall and the quality judgment.

## Reproducible discovery lanes

The default high-precision sweep in
[`discover-graphs-and-ai.ps1`](../../../scripts/discover-graphs-and-ai.ps1)
uses these arXiv expressions, each bounded to the 2026 submission window:

- `all:"graph foundation model"`
- `(all:GraphRAG OR all:"graph retrieval augmented generation" OR all:"graph-augmented RAG" OR all:"graph augmented RAG")`
- `(ti:"graph reasoning" OR ti:"reasoning on graphs" OR ti:"reasoning over graphs") AND (all:"large language model" OR all:LLM)`
- `all:"neural algorithmic reasoning"`
- `(ti:"graph algorithm" OR ti:"graph algorithms") AND (all:neural OR all:"large language model" OR all:LLM)`
- `all:"graph neural network" AND (ti:benchmark OR ti:evaluation)`
- `all:"graph learning" AND (ti:benchmark OR ti:evaluation OR ti:diagnostic)`
- `(all:"knowledge graph foundation model" OR all:"inductive knowledge graph reasoning")`
- `all:"graph generation" AND (all:"foundation model" OR all:"large language model")`
- `all:"graph transformer" AND (ti:benchmark OR ti:evaluation)`
- `(all:"large language model" OR all:LLM) AND (all:"graph structured data" OR all:"text-attributed graph") AND (all:benchmark OR all:evaluation OR all:reasoning)`
- `(all:"large language model" OR all:LLM) AND (ti:"graph property" OR ti:"graph properties" OR ti:"graph inference")`

The optional recall expansion adds broader title searches. Discovery output is
stored under ignored `.know/research-discovery/` with query-level counts,
deduplicated records, abstracts, categories, authors, timestamps, and canonical
links.

At this cutoff, the high-precision lanes produced **339 deduplicated
candidates**. The expanded sweep produced **377**, adding 38 candidates for
manual review. Four expanded-only papers cleared the threshold and the other 34
were excluded. Together, the lanes reproduce all 39 retained 2026 papers.

## Admission threshold

A paper must be directly relevant to a general Graphs-and-AI question and meet
at least one strong evidence signal:

- durable foundational importance or substantial independent adoption;
- credible peer-review status;
- a benchmark with meaningful scale, released data or code, and competitive
  baselines;
- a controlled comparison or ablation that isolates graph structure;
- a formal result paired with experiments that test its assumptions;
- a useful negative result, replication, diagnostic, or security evaluation;
- broad multi-domain transfer rather than a single narrow application.

Current preprints are admitted only when their design is inspectable and their
contribution would remain useful even if the headline ranking later changes.
ArXiv presence, author reputation, a large claimed gain, or use of the words
*foundation model* is not sufficient by itself.

## Quality labels

- **Anchor:** foundational, peer-reviewed, widely reproduced, or independently
  influential prior work. The label does not mean every claim is correct.
- **Current-strong:** a 2026 contribution that clears the evidence threshold but
  may still be an unreviewed preprint. Claims remain provisional until
  independently reproduced or peer reviewed.

Low-quality work is excluded rather than assigned a third, weaker tier.

## Common exclusion reasons

- graph terminology is incidental to a domain application;
- evaluation uses one small dataset, weak or mismatched baselines, or no
  variance and ablation reporting;
- the paper claims a universal or foundation model but tests only in-domain;
- GraphRAG is compared against an untuned dense baseline with unmatched models,
  prompts, retrieval budgets, or context;
- an LLM judges outputs without executable or human-validated ground truth;
- no accessible paper, data, implementation, or sufficient methodological
  detail exists;
- the paper is withdrawn, duplicated, superseded without historical value, or
  outside the cutoff.

## Review cautions

The 2026 section is intentionally rich in benchmarks and negative evidence.
Fresh leaderboard gains receive less weight than matched budgets, strong
baselines, cross-domain transfer, state or path correctness, robustness under
degradation, and total indexing/inference cost. Domain-specific biomedical,
chemistry, finance, power-grid, traffic, and recommendation papers are included
only when they introduce a general method or unusually strong evaluation; most
vertical applications are excluded.
