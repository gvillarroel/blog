# ADR 0003: Public Graphs and AI knowledge domain

- Status: Accepted
- Date: 2026-08-14

## Context

The existing public agent-systems corpora do not cover graph theory, graph
representation learning, knowledge graphs, graph foundation models, GraphRAG,
or neural graph reasoning deeply enough for dedicated research. Adding these
papers to the private data-science book corpus would weaken provenance and make
the public collection impossible to reproduce.

## Decision

Create a separate project-local `know` key named `graphs-and-ai`. Maintain its
tracked, public source of truth in
`knowledge/public/graphs-and-ai/catalog.json`, with a human-readable link list
and screening protocol beside it. Use
`scripts/bootstrap-graphs-and-ai.ps1` to register and synchronize sources,
download full PDFs, extract searchable text, export normalized Markdown, and
record content hashes under ignored `.know/` storage. Use
`scripts/validate-graphs-and-ai.ps1` to fail closed on source, title, PDF, hash,
or extracted-text drift. Five bounded primary-site
sources supplement the 109 arXiv papers for official TransE, NetworkX, OGB,
PyTorch Geometric, and Microsoft GraphRAG material.

The domain shares the deduplicated `.know/paper-cache/arxiv/` cache with other
public paper domains. Cache manifests are merged by identifier so rebuilding one
domain cannot remove the provenance records of another.

The snapshot is bounded by a recorded cutoff and reproducible arXiv query
families. It is curated rather than exhaustive across all GNN applications.
Prior work is retained for foundational, peer-reviewed, reproduced, or
benchmark value. A current preprint is retained only for a strong formal,
controlled, diagnostic, benchmark, security, or negative-result contribution.

## Consequences

- Graph research can be queried without diluting the agent or private expert
  domains.
- The paper list, quality decisions, source registrations, PDFs, text, and
  hashes can be audited independently.
- Current-year completeness has a precise, dated, query-bounded meaning.
- The catalog must be refreshed after the cutoff before claiming newer coverage.
- Unreviewed 2026 claims remain explicitly provisional even when admitted.
