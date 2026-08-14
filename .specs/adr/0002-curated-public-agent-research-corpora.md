# ADR 0002: Curated public agent-research corpora

- Status: Accepted
- Date: 2026-08-13

## Context

The blog already has two immutable private expert corpora. Research on agent
harnesses, tool and code execution, long-running processes, skills, skill and
harness evolution, evaluation, and context injection also needs a reproducible
collection of current public papers. Mixing downloaded public papers into the
private expert domains would blur provenance, make quality controls harder to
audit, and weaken the repository's publication boundary.

## Decision

Create three project-local `know` domains:

- `agent-harnesses` for harness architecture, tool and code execution,
  long-horizon operation, evaluation, and harness evolution;
- `agent-skills` for skill architecture, generation, use, evaluation,
  evolution, lifecycle governance, and empirical security;
- `agent-context` for context assembly, retrieval, memory, compaction,
  checkpoints, standing instructions, and context evolution.

The public, reviewable catalog and screening rationale live under
`knowledge/public/agent-systems/`. The executable source manifest is
`scripts/bootstrap-agent-research.ps1`, while
`scripts/discover-agent-research.ps1` reproduces the bounded high-precision
candidate sweep. Downloaded papers, normalized text,
indexes, and exports remain under the ignored project-local `.know/` store. A
deduplicated full-PDF and extracted-text cache is stored under
`.know/paper-cache/arxiv/`; its generated manifests bind each PDF to a SHA-256
digest so a later refresh can detect changed content.

The catalog is a dated snapshot rather than a claim that a live literature is
ever permanently complete. Each refresh records a cutoff, query protocol, and
screening rules. A paper is admitted only when it is directly relevant and has
either strong experimental evidence, peer-review status, unusually useful
reproducible artifacts, or clear foundational importance. Withdrawn papers,
work-in-progress claims without adequate evidence, unverified marketing pages,
and domain papers using "harness" in an unrelated sense are excluded.

## Consequences

- Public and private evidence remain provenance-separated.
- The Markdown catalog can be reviewed without exposing private corpus text.
- The three domains can be rebuilt idempotently after cloning by running the
  bootstrap script.
- A paper may appear in more than one domain when its contribution is genuinely
  cross-cutting. This duplicates local source material but improves retrieval
  within each bounded question space.
- The 2026 section must be refreshed after the recorded cutoff before making a
  later completeness claim.
