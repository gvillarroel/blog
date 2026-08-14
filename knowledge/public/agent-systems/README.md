# Curated research on agent harnesses, skills, and context

This is a public, reproducible research snapshot for building and evaluating
tool-using agents. It covers papers published or revised through **2026-08-13**
and a smaller set of foundational papers from prior years.

The collection is deliberately selective. It is not an arXiv dump: papers are
kept when they have strong experimental design, credible peer-review status,
reproducible artifacts, useful negative results, or clear foundational value.
Withdrawn work, unrelated uses of the word *harness*, and weakly evidenced
claims are excluded.

## Collections

| Knowledge domain | Utility-first index | Scope | Curated papers |
|---|---|---|---:|
| [`agent-harnesses`](harnesses.md) | [Ranked table + direct PDFs](harnesses-index.md) | Runtime architecture, tools, code execution, long-running processes, evaluation, and harness evolution | 79 |
| [`agent-skills`](skills.md) | [Ranked table + direct PDFs](skills-index.md) | Skill architecture, use, generation, evaluation, evolution, lifecycle governance, and empirical security | 32 |
| [`agent-context`](context.md) | [Ranked table + direct PDFs](context-index.md) | Context assembly, retrieval, memory, compaction, checkpoints, standing instructions, and context evolution | 31 |

Some cross-cutting papers intentionally occur in more than one domain. The
domain count is therefore not a unique-paper count.

Materialized snapshot verification on 2026-08-13:

- **137 unique PDFs** across 142 domain registrations: **89 admitted 2026
  papers** and **48 prior-year anchors**;
- **490,056,148 PDF bytes** and **3,960 pages**;
- **13,186,844 extracted characters** in searchable UTF-8 text;
- **0 failed extractions**, **0 invalid PDF headers**, and **0 NUL-bearing text
  files** after sanitization.

The [`screening protocol`](screening.md) documents the search vocabulary,
cutoff, evidence grades, exclusions, and the bounded meaning of “all 2026
papers.” The executable source manifest is
[`scripts/bootstrap-agent-research.ps1`](../../../scripts/bootstrap-agent-research.ps1).
The high-precision discovery snapshot can be reproduced with
[`scripts/discover-agent-research.ps1`](../../../scripts/discover-agent-research.ps1).
Regenerate all four utility-first indexes with
[`scripts/build-knowledge-indexes.mjs`](../../../scripts/build-knowledge-indexes.mjs).

## Working definition

An **agent harness** is the executable system around a model. It assembles
context, exposes and mediates tools, maintains state, controls the agent loop,
enforces permissions and budgets, records traces, verifies results, handles
failure and recovery, and decides when execution is complete. A benchmark score
therefore belongs to a **model–harness configuration**, not to a model alone.

A **skill** is a reusable external capability artifact. Depending on the system,
it can be a natural-language procedure, a `SKILL.md` package, executable code, a
workflow graph, or a learned adapter. Calling all of these “skills” without
recording their representation, trigger, tools, and lifecycle makes comparisons
misleading.

**Context engineering** is the harness policy that selects, orders, transforms,
and persists the information visible to the model at each inference step. It is
broader than prompt wording and includes tool schemas and results, retrieved
documents, skills, memory, environment state, summaries, and handoff artifacts.

## What the evidence says so far

1. **The harness is a material experimental variable.** Controlled studies find
   substantial changes in success, cost, failure modes, and even benchmark
   rankings when the model is held fixed and the harness changes.
2. **More feedback compute is not automatically better evolution.** Harness
   evolution must be compared with matched-budget sampling and refinement, use
   disjoint development and test tasks, and report regressions. Several 2026
   studies show that apparent improvement shrinks or fails to transfer under
   those controls.
3. **Tools need executable contracts, not only descriptions.** Strong
   evaluations run in pinned environments, check resulting state, capture full
   trajectories, and separate executor from grader. Final-answer judging alone
   misses invalid calls, fabricated tool results, policy violations, and
   regressions.
4. **Long-running execution is an external-state problem as much as a context
   window problem.** The most credible systems externalize task state, use
   checkpoints or durable artifacts, verify state transitions, and resume with
   bounded context. Simply retaining a longer transcript is expensive and can
   reduce reliability.
5. **Skills are not uniformly helpful.** Their effect depends on selection,
   relevance, version compatibility, model and harness behavior, and lifecycle
   governance. Controlled studies report null effects, negative transfer, and
   library drift alongside large gains from curated or validated skills.
6. **Context compression is an intervention that needs its own evaluation.** A
   plausible summary can still change future actions. Paired continuations from
   the same environment state, retention tests, and downstream task outcomes are
   stronger evidence than summary similarity alone.
7. **Evolution requires release engineering.** Candidate changes need versioned
   artifacts, held-out evaluation, regression suites, rollback, provenance, and
   explicit budget accounting. Otherwise self-improvement can silently become
   benchmark memorization or production drift.

## Rebuild the local knowledge bases

From the repository root:

```powershell
./scripts/bootstrap-agent-research.ps1 -DownloadPdfs -ExtractPdfText
```

This creates the three project-local `know` keys, registers canonical arXiv
sources, synchronizes normalized arXiv metadata and abstracts, downloads one
deduplicated copy of every selected PDF, extracts searchable full text, records
SHA-256 hashes, and exports the `know` sources as normalized Markdown. The
generated material stays inside ignored `.know/` storage and is not publishable
content. Full PDFs and text live under `.know/paper-cache/arxiv/`; `pypdf` is
required only for `-ExtractPdfText`.

Useful checks:

```powershell
know list sources --key agent-harnesses
know list sources --key agent-skills
know list sources --key agent-context

rg -i -l "matched.*(feedback|compute)|held-out" .know/paper-cache/arxiv -g paper.txt
rg -i -l "skill.*(harm|negative|drift)" .know/paper-cache/arxiv -g paper.txt
rg -i -l "compaction.*(failure|instability)|context compression" .know/paper-cache/arxiv -g paper.txt
```

To register sources without downloading them:

```powershell
./scripts/bootstrap-agent-research.ps1 -RegisterOnly
```

Without `-DownloadPdfs`, the bootstrap still synchronizes the canonical arXiv
record and abstract for each `know` source. `-DownloadPdfs` is idempotent and
validates the `%PDF-` header before accepting a cached file; `-ExtractPdfText`
implies PDF download and skips text files that are newer than their PDF.

To refresh the auditable candidate pool at a later cutoff before changing the
curated manifest:

```powershell
./scripts/discover-agent-research.ps1 -Cutoff '2026-08-13T23:59:59Z' -IncludeRecallExpansion
```

The deduplicated discovery JSON is written under ignored
`.know/research-discovery/` and includes the query family that found each paper.

## Provenance boundary

This public collection is separate from the repository's private expert
corpora. Private books informed the screening questions—especially the need for
control and observability, executable oracles, resilience, isolation, and
guardrails—but no private corpus passage is copied into these files or the
public source manifest.
