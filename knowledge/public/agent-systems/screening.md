# Search and screening protocol

## Snapshot

- Search cutoff: **2026-08-13, America/New_York**
- Primary paper index: arXiv API and canonical arXiv records
- Venue verification: arXiv comments/journal references and linked official
  proceedings or project artifacts where available
- Engineering/specification sources: first-party documentation only
- Output language: English, following repository documentation policy

The catalog is a dated systematic snapshot, not a permanent universal claim.
New papers, revised versions, renamed concepts, and papers missing the selected
vocabulary can appear after the cutoff.

## Search coverage

The high-precision discovery pass used six arXiv title/abstract query families
and retained records first published in 2026 through the cutoff:

| Query family | 2026 candidates | All-year API results at cutoff |
|---|---:|---:|
| `all:"agent harness"` | 204 | 214 |
| `all:"agent skills"` | 272 | 306 |
| `all:"skill evolution" AND all:agent` | 55 | 57 |
| `all:"context engineering" AND all:agent` | 57 | 79 |
| `all:"long-horizon agents"` | 167 | 188 |
| `all:"tool-using agents"` | 132 | 167 |

The bounded high-precision pass is executable as
[`scripts/discover-agent-research.ps1`](../../../scripts/discover-agent-research.ps1);
it records query membership, canonical IDs, abstracts, authors, dates,
categories, and direct paper/PDF URLs in ignored discovery JSON. Pass
`-IncludeRecallExpansion` to add the three broader title-query families.

The high-precision union contained **841 deduplicated 2026 candidates**.
Recall-expansion passes then searched title terms for `harness`, `harnesses`,
`scaffold`, `skill`, `skills`, `context`, `memory`, and `compaction`, combined
with agent/LLM language where needed and the same date boundary:

| Recall-expansion family | 2026 candidates |
|---|---:|
| `(ti:harness OR ti:harnesses OR ti:scaffold)` | 487 |
| `(ti:skill OR ti:skills) AND all:agent` | 499 |
| `(ti:context OR ti:memory OR ti:compaction) AND all:agent` | 1,271 |

The nine-query expanded union contained **2,611 deduplicated candidates**.
Many were unrelated or weakly related uses—such as photonics, wiring, or human
activity recognition—or narrow application papers with no transferable agent
system contribution. Metadata/abstract relevance filters reduced that pool
before human review of the shortlist.

Seminal prior work was found by backward and forward chaining from surveys,
benchmarks, and accepted papers, then verified against its primary record. Web
search was used for discovery only; the catalog links to the paper, official
specification, or first-party engineering source rather than a search result.

After relevance and quality screening, **89 unique 2026 papers** were admitted
to at least one downloadable domain: 56 came from the high-precision union, 27
from the title expansions, and six from benchmark/survey discovery plus citation
chaining. Another 48 prior-year papers were retained as foundational or
connective anchors.

## Inclusion grades

The letters in the topic catalogs are evidence grades, not paper rankings.

| Grade | Admission rule | Appropriate use |
|---|---|---|
| **A** | Selective peer review or unusually strong direct evidence: executable tasks, credible controls, deterministic or human-validated scoring, held-out evaluation, multiple models/environments, and/or open artifacts | Anchor claims and evaluation design |
| **B** | Relevant and technically serious preprint with useful empirical evidence, but narrower scope, early results, limited environments, missing artifacts, or unresolved external-validity questions | Generate hypotheses and implementation options; re-check before strong claims |
| **R** | High-quality survey, standard, or first-party engineering reference; it maps concepts or deployed mechanisms but is not independent outcome evidence | Terminology, architecture, and discovery |

A paper need not satisfy every A-grade signal, but no single vanity metric or
author affiliation is sufficient. Negative results and replications are favored
when their controls are strong.

## Full-screen questions

For shortlisted work, the review asks:

1. Is the harness boundary explicit—model, prompts, tools, memory, loop,
   sandbox, verifier, budget, and version?
2. Are tasks executable and environments pinned, or is grading primarily an
   unvalidated LLM opinion?
3. Does the design isolate model effects from harness effects?
4. For evolution, are development feedback and final test tasks disjoint? Are
   sampling, refinement, and matched-feedback-compute baselines included?
5. Are regressions, variance, repeated runs, costs, and failure cases reported?
6. Can artifacts, code, tasks, traces, or at least complete procedures be
   inspected?
7. Does the conclusion stay within the evaluated domains and models?
8. Is the paper current, non-withdrawn, and internally consistent?

## Exclusion policy and examples

The following are excluded from the downloadable corpus:

- unrelated senses of *harness* or *skill*;
- withdrawn papers or versions whose authors say the results should not be
  relied upon;
- proposals, opinion pieces, and works in progress without adequate evidence;
- tiny demonstrations whose general claims exceed their evaluation;
- domain-specific applications that contribute no transferable harness, skill,
  context, or evaluation method;
- duplicate or superseded versions;
- aggregator pages when the primary paper or official source is available.

Concrete decisions:

| Candidate | Decision | Reason |
|---|---|---|
| [An Executable Benchmarking Suite for Tool-Using Agents (2605.11030)](https://arxiv.org/abs/2605.11030) | Excluded | Withdrawn; the record reports substantive errors affecting interpretation and says the current version should not be relied upon |
| [Towards Direct Evaluation of Harness Optimizers via Priority Ranking (2605.22505)](https://arxiv.org/abs/2605.22505) | Excluded for now | Explicitly marked work in progress |
| [Agentic Harnesses: LLM-Driven Verification Layers for Robot Autonomy (2608.09857)](https://arxiv.org/abs/2608.09857) | Excluded for now | Record says it is not finalized for conference submission; narrow early evidence |
| [LongCLI-Bench (2602.14337)](https://arxiv.org/abs/2602.14337) | Included as B | Only 20 tasks and explicitly preliminary, but executable dual-test and step-level protocol are useful for long-horizon evaluation |
| [MOSS (2605.22794)](https://arxiv.org/abs/2605.22794) | Included as B | Strong deployment controls and rollback design, but the reported outcome study is only four tasks on one substrate |
| [HARBOR (2604.20938)](https://arxiv.org/abs/2604.20938) | Included as B | Useful optimization formalization with safety constraints, but empirical evidence is a small production case study |

## Refresh procedure

1. Repeat the bounded queries with a new cutoff and store the counts.
2. Diff canonical arXiv IDs against the executable manifest.
3. Re-check version, withdrawal, venue, and artifact status for all B-grade work.
4. Apply the same controls to new papers; do not lower the threshold to match
   publication volume.
5. Update the topic Markdown, script manifest, corpus counts, and ADR only when
   the architecture or policy changes.
6. Re-run `./scripts/bootstrap-agent-research.ps1` and repository validation.
