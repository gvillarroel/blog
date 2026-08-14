# Graphs and AI knowledge domain

`graphs-and-ai` is a public, reproducible `know` domain for the intersection of
graph theory and artificial intelligence. Its dated snapshot covers work
published or revised through **2026-08-14** and contains **114 sources**: **109
curated arXiv papers**—39 from 2026 plus 70 prior-year anchors—and **5 maintained
primary web references**.

The collection is deliberately broad enough to connect the mathematics to
current systems, but selective enough to remain useful. It covers:

- graph theory and geometric or relational inductive bias;
- graph representation learning, GNNs, transformers, state-space models, and
  dynamic graphs;
- evaluation pitfalls, heterophily, long-range dependencies, robustness, and
  explainability;
- knowledge graphs, link prediction, and inductive relational reasoning;
- graph generation and neural algorithmic reasoning;
- LLM graph understanding, graph foundation models, and GraphRAG;
- current 2026 transfer, benchmarking, security, and negative-result studies.

Start with the [utility-first table](index.md), which places broader and more
decision-relevant papers first and gives every paper its own direct PDF column.
The complete topic-grouped catalog is in [papers.md](papers.md). The executable
metadata manifest is [catalog.json](catalog.json), and
[screening.md](screening.md) defines the search vocabulary, quality threshold,
and bounded meaning of current-year coverage.

## Working model

Graphs enter AI in three materially different roles:

1. **Data representation:** nodes, edges, types, attributes, time, geometry,
   and higher-order relations are the input to a learned model.
2. **Computation:** message passing, attention, diffusion, search, dynamic
   programming, and learned algorithm execution operate over graph structure.
3. **External knowledge and control:** knowledge graphs and graph indices guide
   retrieval, reasoning, provenance, memory, and tool or agent decisions.

Keeping these roles distinct prevents misleading comparisons. A model that
predicts node labels, an LLM that reads a serialized edge list, and a GraphRAG
system that constructs and traverses an index do not solve the same problem and
should not share an undifferentiated benchmark score.

## Evidence-backed takeaways

1. **Evaluation design often dominates small architecture gains.** Dataset
   splits, tuning budgets, baseline strength, graph size, structural leakage,
   and homophily can reverse rankings.
2. **Long-range reasoning is constrained by both topology and representation.**
   Message-passing bottlenecks, over-squashing, positional encodings, graph
   serialization, and context budgets create different failure modes.
3. **A graph is not automatically helpful to an LLM.** Controlled RAG studies
   find gains for some multi-hop or global questions, but null effects or worse
   cost-quality tradeoffs for simpler queries and noisy graph construction.
4. **Foundation-model claims require cross-domain tests.** In-domain accuracy is
   insufficient; strong evidence reports unseen graphs, feature and label-space
   shifts, tuned non-foundation baselines, adaptation cost, and negative
   transfer.
5. **Graph reasoning needs process-sensitive evaluation.** Final-answer
   accuracy can hide invalid paths, shortcut learning, incorrect intermediate
   steps, or failure to execute an algorithm exactly.
6. **Robustness is graph-specific.** Attacks and degradation can target edges,
   node features, text attributes, shared alignment spaces, retrieved
   subgraphs, or logical relations.

## Build the local domain

From the repository root:

```powershell
./scripts/bootstrap-graphs-and-ai.ps1 -DownloadPdfs -ExtractPdfText
```

The command creates the `graphs-and-ai` key, registers and synchronizes 109
canonical arXiv papers and five trusted sites, exports normalized Markdown,
downloads validated PDFs into the shared ignored cache, extracts searchable
UTF-8 text, and records SHA-256 hashes. Generated content remains under `.know/`
and must not be committed.

Faster registration-only and metadata-only modes are available:

```powershell
./scripts/bootstrap-graphs-and-ai.ps1 -RegisterOnly
./scripts/bootstrap-graphs-and-ai.ps1
```

Inspect or search the resulting domain with:

```powershell
know list sources --key graphs-and-ai
know search arxiv 'all:"graph foundation model"' --registered-key graphs-and-ai

rg -i -l "over-squashing|heterophily|negative transfer" .know/paper-cache/arxiv -g paper.txt
rg -i -l "GraphRAG.*(cost|latency|null result)|VectorRAG" .know/paper-cache/arxiv -g paper.txt
```

Validate the materialized key, source identities, PDF headers, SHA-256 hashes,
UTF-8 text, and page markers with:

```powershell
./scripts/validate-graphs-and-ai.ps1
```

The 2026-08-14 materialization passed with 114 registered sources, 109/109
validated PDFs (250,965,641 bytes), 109/109 substantial text extractions, 3,077
pages, 10,387,905 extracted characters, and zero hash or extraction failures.
The shared deduplicated cache contained 246 PDF and text records.

To refresh the current-year candidate pool before editing the curated catalog:

```powershell
./scripts/discover-graphs-and-ai.ps1 -Cutoff '2026-08-14T23:59:59Z'
./scripts/discover-graphs-and-ai.ps1 -Cutoff '2026-08-14T23:59:59Z' -IncludeRecallExpansion
```

## Provenance boundary

This public domain is independent of the private `data-science` and
`software-engineering` expert corpora. The private retrieval workflow was
consulted for scope, but it returned no graph-specific authoritative evidence
for this task. No private source text, path, locator, or derived excerpt is
copied into this catalog.
