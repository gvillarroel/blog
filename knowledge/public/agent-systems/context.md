# Context injection and long-horizon context management

This catalog covers how harnesses select and inject information at inference
time, how they externalize state across long runs, and how those policies are
evaluated or evolved. The snapshot cutoff is **2026-08-13**. Grades follow the
[screening protocol](screening.md): **A** is anchor evidence, **B** is a useful
but provisional or narrower study, and **R** is a survey/specification or
first-party engineering reference.

## How context reaches an agent today

| Mechanism | What the harness injects | Typical trigger | Main failure to test |
|---|---|---|---|
| Privileged instructions | System/developer prompt, policy files, repository instructions, safety rules | Session start and sometimes every turn | Conflicts, stale rules, weak precedence, overlong standing instructions |
| Tool contracts | Tool names, descriptions, schemas, permissions, errors, and result payloads | Eager registration or dynamic discovery | Ambiguous tools, bloated schemas/results, forged outputs, prompt injection |
| Pre-inference retrieval | Ranked document chunks, examples, user/company data | Before the first model call or each turn | Retrieval miss, irrelevant volume, provenance loss, embedding collisions |
| Just-in-time retrieval | File paths, resource identifiers, search tools, MCP resources, and tool catalogs | Agent decides what to load | Premature stopping, wrong source/tool, excessive exploration |
| Progressive skills | Small name/description catalog, then full instructions, then scripts/references/assets | Model or harness activates a matching skill | Bad trigger, irrelevant skill, version mismatch, malicious code/instructions |
| Interaction trajectory | User messages, assistant state, tool calls/results, observations, error feedback | Appended after each action | Context growth, stale state, duplicated observations, irreversible-error propagation |
| External working state | Files, ledgers, task graphs, plans, notebooks, database rows, checkpoints | Explicit reads/writes and lifecycle boundaries | Unsynchronized state, destructive writeback, missing provenance, partial recovery |
| Long-term memory | Retrieved episodes, facts, strategies, preferences, and prior task outcomes | Similarity, recency, policy, or learned controller | Pollution, false promotion, forgotten corrections, privacy leakage |
| Compaction and restart | Summary/compaction item plus selected high-value recent state | Token threshold, learned policy, phase boundary, or failure recovery | Omitted constraints, changed action policy, repeated work, summary drift |
| Multi-agent handoff | Bounded task brief to a fresh context and a returned result/evidence bundle | Delegation or context partitioning | Lost global constraints, duplicated work, unverifiable synthesis |
| Evolved context | Persistent edits to prompts, skills, tool descriptions, knowledge, or memory policy | Validated trajectory feedback | Overfitting, evaluation leakage, regressions, unbounded accumulation |

The recurring design principle is **selective externalization**: keep the model's
active context small and high-signal while preserving inspectable state outside
the context window. Larger windows remain useful, but do not eliminate
relevance, ordering, contamination, or lifecycle problems.

## 2026: context assembly and standing instructions

| Grade | Paper | Why it is retained / principal caution |
|---|---|---|
| A | [Meta Context Engineering via Agentic Skill Evolution](https://arxiv.org/abs/2601.21557) · [PDF](https://arxiv.org/pdf/2601.21557) | Bilevel evolution of reusable context-engineering skills and task context across five domains; connects artifact evolution to per-instance assembly. |
| A | [The Limits of Long-Context Reasoning in Automated Bug Fixing](https://arxiv.org/abs/2602.16069) · [PDF](https://arxiv.org/pdf/2602.16069) | Controlled SWE-bench study with high-quality retrieval shows that access to long context does not imply reliable use of it. |
| B | [Less Context, Better Agents](https://arxiv.org/abs/2606.10209) · [PDF](https://arxiv.org/pdf/2606.10209) | Five-run comparison of full history, recent-tool pruning, and summarization with confidence intervals and cross-model evidence; one enterprise workflow limits generality. |
| A | [What Context Does a Coding Agent Actually Need to Act?](https://arxiv.org/abs/2607.09691) · [PDF](https://arxiv.org/pdf/2607.09691) | Oracle localization, held-out repositories, deterministic patch construction, preregistered hypotheses, and published nulls isolate code representation from discovery. |
| B | [Scoped Verification for Reliable Long-Horizon Agentic Context Evolution](https://arxiv.org/abs/2607.09175) · [PDF](https://arxiv.org/pdf/2607.09175) | Typed graph updates and local validation improve persistent instructions under a controlled shift; evidence is one telecom-derived harness and model family. |
| A | [HANDBOOK.md](https://arxiv.org/abs/2607.25398) · [PDF](https://arxiv.org/pdf/2607.25398) | 65 MCP-based professional tasks governed by 20–124-page mutable handbooks and 824 deterministic required/prohibited-action criteria. |
| A | [Do Context Files Help Coding Agents?](https://arxiv.org/abs/2607.27250) · [PDF](https://arxiv.org/pdf/2607.27250) | Controlled two-agent ablation on real repositories, 288 gold-tested runs, equivalence bounds, a manipulation probe, and released data; useful negative result. |
| B | [TRACE: Trajectory Attribution for Automated Context Engineering](https://arxiv.org/abs/2608.09153) · [PDF](https://arxiv.org/pdf/2608.09153) | Attributes failures across prompts, knowledge, tools, and skills and proposes CREATE/UPDATE repairs; only 60 simulated dissatisfaction traces support the current result. |

## 2026: memory, compaction, and continuity

| Grade | Paper | Why it is retained / principal caution |
|---|---|---|
| A | [Toward Ultra-Long-Horizon Agentic Science](https://arxiv.org/abs/2601.10402) · [PDF](https://arxiv.org/pdf/2601.10402) | Hierarchical cognitive caching accumulates reusable state over 24-hour ML-engineering tasks instead of relying on one transcript. |
| A | [AMA-Bench](https://arxiv.org/abs/2602.22769) · [PDF](https://arxiv.org/pdf/2602.22769) | Real and arbitrarily long synthetic action/observation trajectories, expert/rule QA, and a causal-graph/tool-retrieval baseline expose lossy similarity retrieval. |
| A | [ContextBudget](https://arxiv.org/abs/2604.01664) · [PDF](https://arxiv.org/pdf/2604.01664) | Treats compression timing and amount as a sequential budgeted decision and trains across budget levels on search and compositional QA. |
| B | [ClawVM](https://arxiv.org/abs/2604.10352) · [PDF](https://arxiv.org/pdf/2604.10352) | Harness-enforced typed memory pages, minimum-fidelity invariants, lifecycle flushes, and validated writeback; real-session evidence remains small. |
| A | [MemGym](https://arxiv.org/abs/2605.20833) · [PDF](https://arxiv.org/pdf/2605.20833) | Five tracks across tool dialogue, research, coding, and computer use; explicitly isolates memory from reasoning, retrieval, and tool ability with ablation-verified pipelines. |
| A | [AdaMEM](https://arxiv.org/abs/2606.05684) · [PDF](https://arxiv.org/pdf/2606.05684) | ICML 2026 hybrid long-term trajectories and dynamic short-term strategies across embodied tasks, WebShop, and search, with open code. |
| A | [Control-Plane Placement Shapes Forgetting](https://arxiv.org/abs/2606.15903) · [PDF](https://arxiv.org/pdf/2606.15903) | Thirteen memory configurations, adversarial and external-authored cases, high annotator agreement, open adapters, and explicit latency/cost quantify where mutation control belongs. |
| A | [Selective Memory Retention for Long-Horizon LLM Agents](https://arxiv.org/abs/2606.29178) · [PDF](https://arxiv.org/pdf/2606.29178) | ICML 2026; clean and noisy-write conditions show when retention policies matter and report uncertainty rather than claiming differences on saturated tasks. |
| A | [CompactionRL](https://arxiv.org/abs/2607.05378) · [PDF](https://arxiv.org/pdf/2607.05378) | Jointly trains task execution and summaries for compacted long rollouts, with multiple open backbones and SWE-bench/Terminal-Bench results. |
| A | [ACM: Agentic Context Management](https://arxiv.org/abs/2607.23809) · [PDF](https://arxiv.org/pdf/2607.23809) | Lets the agent decide when to edit active context, offload losslessly to external memory, and retrieve on demand; code, data, and checkpoints are released. |
| B | [Toward Reliable Context Compression for Long-Horizon Agents](https://arxiv.org/abs/2608.06503) · [PDF](https://arxiv.org/pdf/2608.06503) | Paired closed-loop continuations from the same environment state directly test behavioral effects of a compaction event; explicitly preliminary and currently AppWorld-only. |

## Earlier foundations and immediate predecessors

| Year | Paper | Durable contribution |
|---:|---|---|
| 2020 | [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) · [PDF](https://arxiv.org/pdf/2005.11401) | Foundation for combining parametric generation with retrieved non-parametric evidence. |
| 2023 | [Lost in the Middle](https://arxiv.org/abs/2307.03172) · [PDF](https://arxiv.org/pdf/2307.03172) | TACL evidence that position and irrelevant volume impair long-context use. |
| 2023 | [MemGPT](https://arxiv.org/abs/2310.08560) · [PDF](https://arxiv.org/pdf/2310.08560) | Operating-system analogy for virtual context, tiered memory, and explicit paging. |
| 2024 | [Evaluating Very Long-Term Conversational Memory of LLM Agents (LoCoMo)](https://arxiv.org/abs/2402.17753) · [PDF](https://arxiv.org/pdf/2402.17753) | Long conversational histories and multiple memory reasoning types. |
| 2024 | [The Instruction Hierarchy](https://arxiv.org/abs/2404.13208) · [PDF](https://arxiv.org/pdf/2404.13208) | Formalizes privileged instruction precedence and trains conflict handling. |
| 2024 | [AgentDojo](https://arxiv.org/abs/2406.13352) · [PDF](https://arxiv.org/pdf/2406.13352) | Dynamic tool environment for prompt-injection attacks, utility, and defense evaluation. |
| 2024 | [LongMemEval](https://arxiv.org/abs/2410.10813) · [PDF](https://arxiv.org/pdf/2410.10813) | ICLR 2025 benchmark for information extraction, temporal reasoning, knowledge updates, abstention, and long-term memory. |
| 2025 | [MemoryAgentBench](https://arxiv.org/abs/2507.05257) · [PDF](https://arxiv.org/pdf/2507.05257) | Incremental multi-turn evaluation of retrieval, test-time learning, long-range understanding, and selective forgetting. |
| 2025 | [ACON](https://arxiv.org/abs/2510.00615) · [PDF](https://arxiv.org/pdf/2510.00615) | ICML 2026 optimization of observation/history compression under performance and token objectives. |
| 2025 | [Agentic Context Engineering](https://arxiv.org/abs/2510.04618) · [PDF](https://arxiv.org/pdf/2510.04618) | ICLR 2026 generation–reflection–curation loop for evolving context playbooks. |
| 2025 | [AgentFold](https://arxiv.org/abs/2510.24699) · [PDF](https://arxiv.org/pdf/2510.24699) | Proactive multi-scale folding for long-horizon web-agent trajectories. |
| 2025 | [Context as a Tool](https://arxiv.org/abs/2512.22087) · [PDF](https://arxiv.org/pdf/2512.22087) | Treats context management as explicit structured workspace operations for long-horizon software agents. |

## First-party engineering and standards

These sources document deployed mechanisms and normative interfaces. They are
useful implementation evidence but should not replace independent benchmarks.

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
  (Anthropic, 2024): workflow/agent distinction, composable loops, and the
  agent–computer interface.
- [Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
  (Anthropic, 2025): tool ergonomics, token-efficient results, namespacing, and
  evaluation-driven tool improvement.
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  (Anthropic, 2025): minimal high-signal context, just-in-time retrieval,
  compaction, notes, and multi-agent context partitioning.
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
  (Anthropic, 2025): initializer/coding-agent handoff, incremental progress, and
  durable artifacts across context windows.
- [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
  (Anthropic, 2025): on-demand tool discovery and programmatic tool calling to
  avoid eagerly injecting large tool catalogs/results.
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
  (Anthropic, 2026): multi-turn evaluation, transcript evidence, environments,
  graders, and task construction.
- [From model to agent: equipping the Responses API with a computer environment](https://openai.com/index/equip-responses-api-computer-environment/)
  (OpenAI, 2026): persistent containers, shell execution, skills, and native
  compaction for long-running loops.
- [The next evolution of the Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/)
  (OpenAI, 2026): controlled sandboxes, MCP, skills, instruction files,
  snapshotting, and rehydration.
- [A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
  (OpenAI): model, tools, instructions, orchestration, and layered guardrails.
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18/index):
  standard primitives for resources, prompts, and tools, plus capability
  negotiation and lifecycle.
- [Agent Skills specification](https://agentskills.io/specification):
  progressive disclosure from catalog metadata to instructions and on-demand
  resources.
- [METR Task-Completion Time Horizons](https://metr.org/time-horizons/): current
  methodology, public data, analysis code, and reliability curves for long
  software tasks.

## Context-evaluation checklist

- Measure success at the same environment state with and without the context
  intervention; paired continuations are preferable when possible.
- Report retrieval recall/precision, but also downstream action correctness,
  forbidden actions, repeated work, and state divergence.
- Test instruction precedence, adversarial retrieved text, stale facts, version
  conflicts, and secret-bearing tool output.
- Evaluate context length, position, ordering, duplication, and budget—not only
  the presence of a source.
- For compaction, test constraint retention, unresolved work, recent feedback,
  tool state, identifiers, and the ability to resume after a fresh process.
- For external memory, separate admission, mutation, retrieval, forgetting, and
  policy use. Retrieval accuracy alone does not test memory control.
- Keep the evaluator's context and hidden test state separate from the agent's
  mutable context to prevent leakage during evolution.
