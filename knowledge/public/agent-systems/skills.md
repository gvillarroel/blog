# Agent skills: architecture, evaluation, and evolution

This catalog treats a skill as a persistent, reusable capability artifact
outside the base model. The snapshot cutoff is **2026-08-13**. Grades follow
the [screening protocol](screening.md): **A** is anchor evidence, **B** is a
useful but provisional or narrower study, and **R** is a survey/specification.

## Do not compare unlike “skills”

The literature uses *skill* for at least six different artifacts:

1. natural-language procedures or guidelines;
2. `SKILL.md` packages with instructions, scripts, references, and assets;
3. executable functions or generated tools;
4. workflow graphs and orchestration policies;
5. retrieved trajectory fragments or strategy memories;
6. learned model adapters or policies.

Every evaluation should therefore report the representation, trigger and
retriever, context budget, permitted tools, version, provenance, admission
test, and retirement policy. Otherwise “skill gain” can actually be retrieval,
harness, extra-token, or model-training gain.

## 2026: skill evaluation and real-world utility

| Grade | Paper | Why it is retained / principal caution |
|---|---|---|
| A | [Agent Skills in the Wild](https://arxiv.org/abs/2601.10338) · [PDF](https://arxiv.org/pdf/2601.10338) | Large empirical ecosystem and security study with a validated detection framework, released dataset/tooling, and concrete prevalence estimates. |
| A | [“Do Not Mention This to the User”](https://arxiv.org/abs/2602.06547) · [PDF](https://arxiv.org/pdf/2602.06547) | USENIX Security 2026; static plus dynamic verification of 98,380 skills, confirmed malicious behavior, responsible disclosure, and public detection data. |
| A | [Agent Skills: A Data-Driven Analysis of Claude Skills](https://arxiv.org/abs/2602.08004) · [PDF](https://arxiv.org/pdf/2602.08004) | Quantitative analysis of 40,285 public skills covering adoption, duplication, length, category imbalance, and state-changing risks. It characterizes supply, not causal utility. |
| R | [Agent Skills for Large Language Models](https://arxiv.org/abs/2602.12430) · [PDF](https://arxiv.org/pdf/2602.12430) | Architecture/acquisition/security survey that connects `SKILL.md`, progressive disclosure, MCP, deployment, and the research taxonomy. |
| A | [SkillsBench](https://arxiv.org/abs/2602.12670) · [PDF](https://arxiv.org/pdf/2602.12670) | 87 executable tasks in eight domains and 18 model–harness configurations with paired no-skill versus curated-skill conditions and deterministic verifiers. |
| B | [Organizing, Orchestrating, and Benchmarking Agent Skills at Ecosystem Scale](https://arxiv.org/abs/2603.02176) · [PDF](https://arxiv.org/pdf/2603.02176) | Tests hierarchical retrieval and DAG composition from 200 to 200K skills; only 30 artifact tasks and LLM pairwise judging limit the conclusion. |
| A | [SWE-Skills-Bench](https://arxiv.org/abs/2603.15401) · [PDF](https://arxiv.org/pdf/2603.15401) | About 565 instances pair 49 public skills with pinned repositories and deterministic acceptance tests; strong negative result on average utility and token overhead. |
| A | [How Your Credentials Are Leaked by LLM Agent Skills](https://arxiv.org/abs/2604.03070) · [PDF](https://arxiv.org/pdf/2604.03070) | ASE 2026; stratified study of 17,022 skills using static analysis, sandbox execution, intent comparison, responsible disclosure, and released detection assets. |
| A | [How Well Do Agentic Skills Work in the Wild](https://arxiv.org/abs/2604.04323) · [PDF](https://arxiv.org/pdf/2604.04323) | Retrieval from 34K real skills under increasingly realistic conditions; shows gains collapsing toward no-skill baselines and tests task-specific refinement on Terminal-Bench. |
| B | [SkillGenBench](https://arxiv.org/abs/2605.18693) · [PDF](https://arxiv.org/pdf/2605.18693) | Isolates task-conditioned and task-agnostic skill generation from repositories and documents with pinned environments and deterministic execution checks. Very recent benchmark. |
| B | [OpenSkillEval](https://arxiv.org/abs/2605.23657) · [PDF](https://arxiv.org/pdf/2605.23657) | More than 600 dynamically generated artifact tasks and 30 public skills expose model–framework interactions and popularity/quality mismatch; some quality dimensions remain judge-dependent. |
| A | [SkillEvolBench](https://arxiv.org/abs/2605.24117) · [PDF](https://arxiv.org/pdf/2605.24117) | 180 tasks across six executable agent environments, with acquisition vs frozen deployment, context shift, adversarial, composition, model, and harness conditions. Raw trajectories often beat distilled skills. |
| R | [Agent Skill Evaluation and Evolution](https://arxiv.org/abs/2606.11435) · [PDF](https://arxiv.org/pdf/2606.11435) | Focused survey organizing evolution paradigms and benchmark categories. Use for discovery and vocabulary, then return to the primary experiment. |
| A | [Not All Skills Help](https://arxiv.org/abs/2606.15390) · [PDF](https://arxiv.org/pdf/2606.15390) | Randomized skill masking estimates per-skill causal effects across seven models and two agent benchmarks; demonstrates heterogeneous benefit and task-conditioned suppression. |
| R | [Dynamic Agent Skills](https://arxiv.org/abs/2607.10113) · [PDF](https://arxiv.org/pdf/2607.10113) | TMLR 2026 lifecycle survey of 124 papers, with artifact taxonomy, eight-stage lifecycle, update operators, evidence grades, and reporting standards. |
| B | [AEVAL](https://arxiv.org/abs/2607.16345) · [PDF](https://arxiv.org/pdf/2607.16345) | CI-oriented deterministic skill contracts and executor/grader separation expose self-correction bias; production validation is useful but its scale is not fully reported in the abstract. |
| A | [Skill-Use](https://arxiv.org/abs/2608.04828) · [PDF](https://arxiv.org/pdf/2608.04828) | 79 real skills, 177 executable tasks, nine domains, Docker environments, trajectory rubrics, eight models, and two harnesses; separates trigger, compliance, and boundary behavior. |

## 2026: skill evolution and lifecycle governance

| Grade | Paper | Why it is retained / principal caution |
|---|---|---|
| A | [Meta Context Engineering via Agentic Skill Evolution](https://arxiv.org/abs/2601.21557) · [PDF](https://arxiv.org/pdf/2601.21557) | Co-evolves reusable context-engineering skills and task context across five domains; an important bridge between skill and context evolution. |
| A | [CoEvoSkills](https://arxiv.org/abs/2604.01687) · [PDF](https://arxiv.org/pdf/2604.01687) | COLM 2026; co-evolutionary generator and surrogate verifier, SkillsBench comparisons, multiple coding harnesses/models, and released code. |
| B | [Library Drift](https://arxiv.org/abs/2605.19576) · [PDF](https://arxiv.org/pdf/2605.19576) | Reproducible diagnosis of unbounded accumulation and false-positive injection, with eight governance ablations. Evidence is one hard-100 benchmark over 100 rounds. |
| A | [SkillOpt](https://arxiv.org/abs/2605.23904) · [PDF](https://arxiv.org/pdf/2605.23904) | Bounded add/delete/replace edits accepted only on held-out validation; six benchmarks, seven models, three harnesses, 52 cells, transfer tests, and released code. |
| B | [Co-Evolving Skill Generation and Policy Optimization](https://arxiv.org/abs/2606.08755) · [PDF](https://arxiv.org/pdf/2606.08755) | Estimates pre-storage marginal utility with matched rollout groups, directly addressing harmful skills and verifier-aware policy learning; still a recent preprint. |
| B | [MetaSkill-Evolve](https://arxiv.org/abs/2607.05297) · [PDF](https://arxiv.org/pdf/2607.05297) | Two-timescale evolution of task skills and the meta-skill that produces them, with held-out results across OfficeQA, SealQA, and ALFWorld. |
| B | [SKT: Skill-Use Training at Scale](https://arxiv.org/abs/2608.02287) · [PDF](https://arxiv.org/pdf/2608.02287) | 2,000 skills, 4,000 task packages, and 27K+ verified trajectories, plus disjoint evaluation and cross-harness ablations; valuable but too new for independent replication. |
| A | [Rethinking Self-Evolving Agent Skills](https://arxiv.org/abs/2608.02636) · [PDF](https://arxiv.org/pdf/2608.02636) | Controlled multi-round study across 42 runs, 14 settings, five benchmarks, and three models; compares success/failure feedback, validation filtering, robustness, and transfer. |

## Earlier foundations

| Year | Paper | Durable contribution |
|---:|---|---|
| 2023 | [Reflexion](https://arxiv.org/abs/2303.11366) · [PDF](https://arxiv.org/pdf/2303.11366) | Persistent verbal feedback from trajectories as an external learning signal. |
| 2023 | [Voyager](https://arxiv.org/abs/2305.16291) · [PDF](https://arxiv.org/pdf/2305.16291) | Lifelong embodied agent with an executable skill library, automatic curriculum, and iterative prompting. |
| 2023 | [ExpeL](https://arxiv.org/abs/2308.10144) · [PDF](https://arxiv.org/pdf/2308.10144) | AAAI 2024 experiential learning that extracts reusable insights from successes and failures. |
| 2024 | [AutoGuide](https://arxiv.org/abs/2403.08978) · [PDF](https://arxiv.org/pdf/2403.08978) | Generates and selects context-aware guidelines from offline agent experience. |
| 2024 | [DynaSaur](https://arxiv.org/abs/2411.01747) · [PDF](https://arxiv.org/pdf/2411.01747) | COLM 2025 dynamic action creation and accumulation beyond a fixed tool set. |
| 2025 | [SkillWeaver](https://arxiv.org/abs/2504.07079) · [PDF](https://arxiv.org/pdf/2504.07079) | Web agents practice, distill, and reuse skills as APIs across tasks and sites. |
| 2025 | [Reinforcement Learning for Self-Improving Agent with Skill Library](https://arxiv.org/abs/2512.17102) · [PDF](https://arxiv.org/pdf/2512.17102) | Joint policy learning and reusable skill-library construction for interactive agents. |

## Authoritative format and implementation sources

- [Agent Skills overview](https://agentskills.io/home): open-format goals and
  the discovery → activation → execution lifecycle.
- [Agent Skills specification](https://agentskills.io/specification): required
  `SKILL.md` metadata, optional scripts/references/assets, `allowed-tools`, and
  progressive-disclosure constraints.
- [Adding skills support to an agent](https://agentskills.io/client-implementation/adding-skills-support):
  implementation patterns for catalog injection, file-read activation, and
  dedicated activation tools.
- [Best practices for skill creators](https://agentskills.io/skill-creation/best-practices):
  bounded instruction size, focused resources, and retrieval-aware structure.

These are normative or engineering sources, not independent proof that a skill
improves task success.

## Minimum evaluation protocol for an evolving skill library

1. Freeze a no-skill baseline and a human-curated-skill reference.
2. Separate acquisition tasks, validation tasks, and a locked deployment test.
3. Measure selection/triggering, instruction compliance, boundary behavior,
   executable outcome, cost, and latency separately.
4. Compare generated skills with raw successful and failed trajectories; a
   compressed artifact must earn its information loss.
5. Attribute marginal utility per skill or skill family, including negative
   effects and interactions.
6. Test context shift, stale versions, adversarial composition, cross-model and
   cross-harness transfer, and missing tools.
7. Gate admission on validation, cap active-library growth, record provenance,
   and support supersession, retirement, quarantine, and rollback.
8. Treat bundled scripts as privileged supply-chain code: sandbox them, inspect
   stdout and tool results for secret leakage, and bind permissions narrowly.
