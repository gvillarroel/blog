# Agent harnesses, tool execution, and long-running processes

This catalog covers the executable layer around an LLM: context assembly,
agent loops, tools, sandboxes, state, verification, recovery, tracing, and
evaluation. The snapshot cutoff is **2026-08-13**. Grades follow the
[screening protocol](screening.md): **A** is anchor evidence, **B** is a useful
but provisional or narrower study, and **R** is a survey/reference.

Every arXiv entry has both an abstract page and a direct downloadable PDF.

## 2026: harness construction and evolution

| Grade | Paper | Why it is retained / principal caution |
|---|---|---|
| A | [VeRO: A Harness for Agents to Optimize Agents](https://arxiv.org/abs/2602.22480) · [PDF](https://arxiv.org/pdf/2602.22480) | ICML 2026; versioned snapshots, budgeted evaluation, structured observations, and a benchmark make the *optimizer of a target harness* directly measurable. |
| B | [AutoHarness: improving LLM agents by automatically synthesizing a code harness](https://arxiv.org/abs/2603.03329) · [PDF](https://arxiv.org/pdf/2603.03329) | Clean demonstration that generated code can enforce legal actions and even replace an inference-time policy; evidence is limited to TextArena games. |
| A | [Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052) · [PDF](https://arxiv.org/pdf/2603.28052) | Optimizes executable harnesses from histories, code, scores, and traces; includes held-out models, out-of-distribution tests, ablations, and multiple task families. |
| B | [HARBOR: Automated Harness Optimization](https://arxiv.org/abs/2604.20938) · [PDF](https://arxiv.org/pdf/2604.20938) | Formalizes mixed-variable, cost-aware, safety-constrained Bayesian optimization of harness flags. The empirical case is intentionally small. |
| A | [Agentic Harness Engineering](https://arxiv.org/abs/2604.25850) · [PDF](https://arxiv.org/pdf/2604.25850) | Observability-driven evolution with typed failure evidence, falsifiable edit manifests, regression checks, cross-model transfer, and benchmark ablations. |
| R | [Code as Agent Harness](https://arxiv.org/abs/2605.18747) · [PDF](https://arxiv.org/pdf/2605.18747) | Broad survey and taxonomy of code-level harness layers spanning tools, memory, planning, feedback, and multi-agent systems. Use it as a map, not causal evidence. |
| B | [MOSS: Self-Evolution through Source-Level Rewriting](https://arxiv.org/abs/2605.22794) · [PDF](https://arxiv.org/pdf/2605.22794) | Valuable deployment mechanics—ephemeral trial workers, replay, health checks, user-gated promotion, and rollback—but only four OpenClaw tasks support the outcome claim. |
| B | [Scaling Laws for Agent Harnesses via Effective Feedback Compute](https://arxiv.org/abs/2605.29682) · [PDF](https://arxiv.org/pdf/2605.29682) | Separates useful retained feedback from raw tokens or tool calls and reports held-out/prospective fits; the proposed latent coordinate needs independent replication. |
| A | [Harness Updating Is Not Harness Benefit](https://arxiv.org/abs/2605.30621) · [PDF](https://arxiv.org/pdf/2605.30621) | Separates the ability to author an update from the ability to use it, exposing non-monotonic gains and activation/compliance failures across model tiers. |
| B | [Adaptive Auto-Harness](https://arxiv.org/abs/2606.01770) · [PDF](https://arxiv.org/pdf/2606.01770) | Studies open-ended, shifting task streams with a harness tree, routing, and human steering. Three domains are promising but not yet broad enough for a general deployment claim. |
| B | [HarnessForge: Joint Harness and Policy Evolution](https://arxiv.org/abs/2606.01779) · [PDF](https://arxiv.org/pdf/2606.01779) | Explicitly co-optimizes the external harness and internal policy across five benchmarks and two model sizes; useful for studying compatibility, with limited backbone diversity. |
| B | [Evolving Agents in the Dark](https://arxiv.org/abs/2606.05922) · [PDF](https://arxiv.org/pdf/2606.05922) | Retrospective, label-free optimization from past trajectories and self-preference; gains are interesting, but self-validation creates a central reliability risk. |
| B | [From Failed Trajectories to Reliable LLM Agents](https://arxiv.org/abs/2606.06324) · [PDF](https://arxiv.org/pdf/2606.06324) | Harness-aware trace IR maps evidence to scoped repair operators and regression-aware validation; strong mechanism, pending broader artifact verification. |
| A | [Self-Harness: Harnesses That Improve Themselves](https://arxiv.org/abs/2606.09498) · [PDF](https://arxiv.org/pdf/2606.09498) | Weakness mining, proposals, and regression testing across Terminal-Bench, SWE-bench Verified, and AppWorld, with held-in/held-out model–benchmark combinations. |
| B | [Learning to Control LLM Agent Harnesses with Offline Reinforcement Learning](https://arxiv.org/abs/2607.05458) · [PDF](https://arxiv.org/pdf/2607.05458) | Treats harness decisions as a finite-horizon control problem and separates process maturity from final quality; offline support limits when process gains become outcome gains. |
| B | [TTHE: Test-Time Harness Evolution](https://arxiv.org/abs/2607.08124) · [PDF](https://arxiv.org/pdf/2607.08124) | Evolves executable programs on unlabeled test streams across five task families. Execution-derived proxy selection is both its contribution and its main validity risk. |
| A | [HarnessCompass](https://arxiv.org/abs/2608.01918) · [PDF](https://arxiv.org/pdf/2608.01918) | Constrains edits to task-agnostic changes, adds proactive feedback, and optimizes components separately; reports held-out and cross-model transfer against AHE. |
| B | [Harness-R1](https://arxiv.org/abs/2608.02276) · [PDF](https://arxiv.org/pdf/2608.02276) | Learns a model specialized in editing executable runtime harnesses from failure trajectories; useful learned-optimizer direction, still a very recent preprint. |
| B | [EvoHarness-RL](https://arxiv.org/abs/2608.05446) · [PDF](https://arxiv.org/pdf/2608.05446) | Learns when to read and update belief, progress, and experience state; accepted workshop paper, but the principal result is on one ALFWorld/model setting. |
| A | [Evo-Bench: Can Language Models Improve Agent Harness?](https://arxiv.org/abs/2608.09096) · [PDF](https://arxiv.org/pdf/2608.09096) | Common protocol across search, office, and general tasks, nine models, auxiliary evolution tasks, budget scaling, and policy-transfer analysis. |
| A | [One Recipe, Many Harnesses](https://arxiv.org/abs/2608.10178) · [PDF](https://arxiv.org/pdf/2608.10178) | Holds the evolution recipe fixed across eight languages and three models, uses typed failure contracts, and tests held-out transfer and universal-vs-ecosystem-specific components. |

## 2026: evaluating harnesses and separating confounders

| Grade | Paper | Why it is retained / principal caution |
|---|---|---|
| A | [Harness-Bench](https://arxiv.org/abs/2605.27922) · [PDF](https://arxiv.org/pdf/2605.27922) | 106 sandboxed tasks and 5,194 trajectories compare model–harness configurations under shared environments, budgets, artifacts, validators, and traces. |
| A | [The Scaffold Effect in Coding Agents](https://arxiv.org/abs/2607.22585) · [PDF](https://arxiv.org/pdf/2607.22585) | Directly measures harness-dependent success, token cost, and failure fingerprints; only 50 tasks and workshop/preliminary status keep it from being a sole anchor. |
| A | [Rethinking the Evaluation of Harness Evolution for Agents](https://arxiv.org/abs/2607.12227) · [PDF](https://arxiv.org/pdf/2607.12227) | Essential matched-feedback/compute comparison against parallel sampling and sequential refinement with disjoint splits; finds inconsistent benefits and weak generalization. |
| A | [Don't Blame the Large Language Model](https://arxiv.org/abs/2607.03691) · [PDF](https://arxiv.org/pdf/2607.03691) | Controlled longitudinal study of 35 harness releases on a fixed model and stratified SWE-bench tasks, linked back to concrete harness changes. |
| A | [LoopsBench](https://arxiv.org/abs/2608.00267) · [PDF](https://arxiv.org/pdf/2608.00267) | 112 long-horizon tasks represented as dependency DAGs with 5,300+ executable units, regression obligations, open data, and loop-profile comparisons. |
| B | [CurveShift](https://arxiv.org/abs/2608.00355) · [PDF](https://arxiv.org/pdf/2608.00355) | Shows how scalar progress metrics and model–harness co-change can distort conclusions; clean identification ultimately rests on one non-agentic coding panel. |
| A | [Same Task, Different Work](https://arxiv.org/abs/2608.01347) · [PDF](https://arxiv.org/pdf/2608.01347) | Preregistered 4,644-run study across 24 deterministic tasks, seven models, and two harnesses, with frozen holdout, paraphrase, and model replication. |
| A | [HarnessOpt-Bench](https://arxiv.org/abs/2608.06301) · [PDF](https://arxiv.org/pdf/2608.06301) | Held-out test partition, trusted execution boundary, fixed target-evaluation budget, versioned candidates, five optimizer models, four tasks, and 111 scored runs. |
| B | [The Scaffolding Matters More Than the Interface](https://arxiv.org/abs/2608.08654) · [PDF](https://arxiv.org/pdf/2608.08654) | Seven scaffoldings and five models reveal huge cost variation and agents ignoring assigned MCP/CLI interfaces; conclusions are bounded by one software task. |
| B | [Deployment Decision Reliability](https://arxiv.org/abs/2608.11323) · [PDF](https://arxiv.org/pdf/2608.11323) | Generalizability-theory decomposition across three trace benchmarks, with three estimators and open artifacts; useful evaluation-sizing proposal awaiting replication. |
| A | [Harness-IF](https://arxiv.org/abs/2608.11727) · [PDF](https://arxiv.org/pdf/2608.11727) | Evaluates instruction following across five harness surfaces with realistic multi-turn coding items, a large rule library, deterministic checks, and clustered uncertainty. |

## 2026: tools, code execution, and long horizons

| Grade | Paper | Why it is retained / principal caution |
|---|---|---|
| A | [Toward Ultra-Long-Horizon Agentic Science](https://arxiv.org/abs/2601.10402) · [PDF](https://arxiv.org/pdf/2601.10402) | Hierarchical cognitive caching and multi-stage execution are evaluated on 24-hour ML-engineering runs; directly relevant to persistence beyond one context window. |
| A | [Terminal-Bench](https://arxiv.org/abs/2601.11868) · [PDF](https://arxiv.org/pdf/2601.11868) | Hard, realistic command-line tasks with human-authored solutions and comprehensive executable tests; a central environment for harness comparisons. |
| B | [ToolPRMBench](https://arxiv.org/abs/2601.12294) · [PDF](https://arxiv.org/pdf/2601.12294) | Large step-level process-reward benchmark built from offline and online tool trajectories with multi-model label verification; under review and artifacts were promised rather than verified at screening. |
| A | [MCP-Atlas](https://arxiv.org/abs/2602.00933) · [PDF](https://arxiv.org/pdf/2602.00933) | 1,000 expert-verified tasks, 36 real MCP servers, 220 tools, 20 models, containerized harness, claim-level scoring, and a reserved private split. |
| B | [LongCLI-Bench](https://arxiv.org/abs/2602.14337) · [PDF](https://arxiv.org/pdf/2602.14337) | Executable fail-to-pass/pass-to-pass and step-level evaluation for long CLI workflows; informative but explicitly preliminary and only 20 tasks. |
| A | [The Limits of Long-Context Reasoning in Automated Bug Fixing](https://arxiv.org/abs/2602.16069) · [PDF](https://arxiv.org/pdf/2602.16069) | Controls retrieval quality and context length on SWE-bench Verified, separating context access from the ability to use it. |
| A | [AgentProcessBench](https://arxiv.org/abs/2603.14465) · [PDF](https://arxiv.org/pdf/2603.14465) | 1,000 trajectories, 8,509 human step labels, high annotator agreement, explicit neutral actions, and open code/data for process-quality diagnosis. |
| B | [Demystifying Reinforcement Learning for Long-Horizon Tool-Using Agents](https://arxiv.org/abs/2603.21972) · [PDF](https://arxiv.org/pdf/2603.21972) | Controlled study of five RL design axes with open code; practical recipe is demonstrated mainly on TravelPlanner. |
| R | [Agentic Tool Use in Large Language Models](https://arxiv.org/abs/2604.00835) · [PDF](https://arxiv.org/pdf/2604.00835) | Current survey spanning prompting, supervised tool learning, reward-driven policies, evaluation, and failure modes. |
| B | [ClawVM](https://arxiv.org/abs/2604.10352) · [PDF](https://arxiv.org/pdf/2604.10352) | EuroMLSys 2026 workshop; typed pages, fidelity invariants, budgeted representations, and validated lifecycle writeback. Real-trace evaluation is small. |
| A | [GTA-2](https://arxiv.org/abs/2604.15715) · [PDF](https://arxiv.org/pdf/2604.15715) | Bridges atomic tool use to open-ended workflows using real queries/tools and recursively verifiable checkpoints; exposes a large workflow capability cliff. |
| A | [Auditing Automated Evaluation, Error Propagation, and Runtime Mitigation](https://arxiv.org/abs/2604.16706) · [PDF](https://arxiv.org/pdf/2604.16706) | 14,750 traces, 13 agents, human-calibrated graders, error-propagation analysis, fabricated-tool detection, and open labels/code. |
| A | [RoadmapBench](https://arxiv.org/abs/2605.15846) · [PDF](https://arxiv.org/pdf/2605.15846) | 115 real version-upgrade tasks across 17 repositories and five languages, with large multi-file changes and 13 frontier models. |
| B | [Less Context, Better Agents](https://arxiv.org/abs/2606.10209) · [PDF](https://arxiv.org/pdf/2606.10209) | Five-run context-retention comparison with confidence intervals, sensitivity analysis, and cross-model evidence; one enterprise expense workflow limits generalization. |
| A | [StaminaBench](https://arxiv.org/abs/2606.19613) · [PDF](https://arxiv.org/pdf/2606.19613) | Procedural black-box tasks extended to 100 sequential turns across six harnesses and seven open models, with released code/data. |
| A | [PlanBench-XL](https://arxiv.org/abs/2606.22388) · [PDF](https://arxiv.org/pdf/2606.22388) | 327 tasks over 1,665 retrieval-limited tools, with blocked, failing, missing, and distracting tools; evaluates ten models and recovery over alternative paths. |
| A | [DeepSWE](https://arxiv.org/abs/2607.07946) · [PDF](https://arxiv.org/pdf/2607.07946) | 113 original unpublished tasks across 91 repositories/five languages, hand-written verifiers, grader-disagreement analysis, and released trajectories. |
| A | [LongHorizon-Harness](https://arxiv.org/abs/2608.01964) · [PDF](https://arxiv.org/pdf/2608.01964) | External verified task state plus manager–executor–auditor separation; gains transfer across models, harnesses, and WeaveBench, Terminal-Bench, and OSWorld. |

## Prior work: foundations and durable benchmarks

| Year | Paper | Durable contribution |
|---:|---|---|
| 2022 | [ReAct](https://arxiv.org/abs/2210.03629) · [PDF](https://arxiv.org/pdf/2210.03629) | ICLR foundation for interleaving reasoning and environment actions. |
| 2023 | [Toolformer](https://arxiv.org/abs/2302.04761) · [PDF](https://arxiv.org/pdf/2302.04761) | Self-supervised learning of tool calls. |
| 2023 | [Large Language Models as Tool Makers](https://arxiv.org/abs/2305.17126) · [PDF](https://arxiv.org/pdf/2305.17126) | Separates tool creation from reuse and introduces reusable generated tools. |
| 2023 | [WebArena](https://arxiv.org/abs/2307.13854) · [PDF](https://arxiv.org/pdf/2307.13854) | Reproducible realistic web environment with functional end-state evaluation. |
| 2023 | [AgentBench](https://arxiv.org/abs/2308.03688) · [PDF](https://arxiv.org/pdf/2308.03688) | Multi-environment agent evaluation. |
| 2023 | [Large Language Models as Optimizers (OPRO)](https://arxiv.org/abs/2309.03409) · [PDF](https://arxiv.org/pdf/2309.03409) | ICLR 2024 language-space optimization with score feedback. |
| 2023 | [Promptbreeder](https://arxiv.org/abs/2309.16797) · [PDF](https://arxiv.org/pdf/2309.16797) | Self-referential evolutionary prompt mutation. |
| 2023 | [DSPy](https://arxiv.org/abs/2310.03714) · [PDF](https://arxiv.org/pdf/2310.03714) | Declarative LM programs compiled and optimized against metrics. |
| 2023 | [SWE-bench](https://arxiv.org/abs/2310.06770) · [PDF](https://arxiv.org/pdf/2310.06770) | ICLR 2024 executable issue-resolution benchmark that catalyzed coding-agent harness research. |
| 2023 | [GAIA](https://arxiv.org/abs/2311.12983) · [PDF](https://arxiv.org/pdf/2311.12983) | Real-assistant questions requiring reasoning, multimodality, browsing, and tools. |
| 2024 | [AgentBoard](https://arxiv.org/abs/2401.13178) · [PDF](https://arxiv.org/pdf/2401.13178) | Fine-grained progress and failure analytics beyond final success. |
| 2024 | [CodeAct](https://arxiv.org/abs/2402.01030) · [PDF](https://arxiv.org/pdf/2402.01030) | ICML 2024 evidence that executable code actions can outperform JSON/text action formats. |
| 2024 | [OSWorld](https://arxiv.org/abs/2404.07972) · [PDF](https://arxiv.org/pdf/2404.07972) | Open-ended multimodal computer-use environment. |
| 2024 | [SWE-agent](https://arxiv.org/abs/2405.15793) · [PDF](https://arxiv.org/pdf/2405.15793) | Demonstrated that the agent–computer interface itself materially changes software-agent performance. |
| 2024 | [TextGrad](https://arxiv.org/abs/2406.07496) · [PDF](https://arxiv.org/pdf/2406.07496) | Textual feedback as gradients over compound LM systems. |
| 2024 | [$\tau$-bench](https://arxiv.org/abs/2406.12045) · [PDF](https://arxiv.org/pdf/2406.12045) | Tool–agent–user interaction with policy constraints and repeated-run reliability. |
| 2024 | [OpenHands](https://arxiv.org/abs/2407.16741) · [PDF](https://arxiv.org/pdf/2407.16741) | ICLR 2025 open platform for generalist software agents. |
| 2024 | [AppWorld](https://arxiv.org/abs/2407.18901) · [PDF](https://arxiv.org/pdf/2407.18901) | ACL 2024 controllable app world with APIs and executable state. |
| 2024 | [ToolSandbox](https://arxiv.org/abs/2408.04682) · [PDF](https://arxiv.org/pdf/2408.04682) | Stateful, conversational tool-use evaluation with milestones and hidden state. |
| 2024 | [Automated Design of Agentic Systems](https://arxiv.org/abs/2408.08435) · [PDF](https://arxiv.org/pdf/2408.08435) | Search over code-defined agent systems rather than isolated prompts. |
| 2024 | [CORE-Bench](https://arxiv.org/abs/2409.11363) · [PDF](https://arxiv.org/pdf/2409.11363) | Executable computational-reproducibility tasks. |
| 2024 | [AgentSquare](https://arxiv.org/abs/2410.06153) · [PDF](https://arxiv.org/pdf/2410.06153) | Modular search across planning, reasoning, tool use, and memory components. |
| 2024 | [MLE-bench](https://arxiv.org/abs/2410.07095) · [PDF](https://arxiv.org/pdf/2410.07095) | ICLR benchmark for end-to-end ML engineering in Kaggle environments. |
| 2024 | [AFlow](https://arxiv.org/abs/2410.10762) · [PDF](https://arxiv.org/pdf/2410.10762) | Automated generation and optimization of agentic workflows represented as code. |
| 2024 | [RE-Bench](https://arxiv.org/abs/2411.15114) · [PDF](https://arxiv.org/pdf/2411.15114) | Long-form AI R&D tasks compared with human experts under time budgets. |
| 2025 | [Measuring AI Ability to Complete Long Software Tasks](https://arxiv.org/abs/2503.14499) · [PDF](https://arxiv.org/pdf/2503.14499) | NeurIPS 2025 methodology for task-completion time horizons and reliability curves. |
| 2025 | [PaperBench](https://arxiv.org/abs/2504.01848) · [PDF](https://arxiv.org/pdf/2504.01848) | Long-horizon replication of AI research with hierarchical rubrics and reproducible environments. |
| 2025 | [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) · [PDF](https://arxiv.org/pdf/2505.22954) | Open-ended, archive-based self-modification of coding agents with empirical validation. |
| 2025 | [GEPA](https://arxiv.org/abs/2507.19457) · [PDF](https://arxiv.org/pdf/2507.19457) | ICLR 2026 oral; reflective prompt/program evolution, trajectory diagnosis, and Pareto recombination under far fewer rollouts than RL baselines. |

## Evaluation checklist distilled from the corpus

For a credible harness comparison, record at minimum:

- exact model and harness versions, prompts, tool schemas, permissions,
  environment image, budgets, stopping rules, and retry policy;
- development, validation, and locked test partitions, plus contamination checks;
- matched token, call, wall-clock, dollar, and feedback budgets;
- repeated runs with confidence intervals or hierarchical uncertainty;
- executable end-state tests and process evidence, not self-reported completion;
- tool-call validity, state changes, regressions, fabricated results, and policy
  compliance;
- trajectory and failure taxonomy, including recoverable vs irreversible errors;
- change manifests, ablations, cross-model transfer, rollback, and the complete
  list of regressions for evolved harnesses.
