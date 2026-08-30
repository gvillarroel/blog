# Modern Skill Evaluation and Evolution

## A framework selection guide for models, agent harnesses, and reusable skills

**Revised final report - 2026-08-30** · **Author:** Gerardo Villarroel
**Primary question:** How can we prove that a versioned skill improved an agent on unseen
work without confusing that effect with model, harness, environment, or grader changes?
([NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports),
[Harness-Bench](https://arxiv.org/abs/2605.27922)).

> The modern unit of progress is not a leaderboard score. It is a controlled,
> reproducible promotion decision backed by task outcomes, trajectories, artifacts,
> uncertainty, and an untouched holdout. ([Reusable Holdout](https://arxiv.org/abs/1506.02629),
> [Harbor results and artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)).

![Conceptual path from immutable traces through persistent knowledge to gated skill promotion](assets/modern-skill-evaluation/skill-evaluation-hero.png)

*Conceptual orientation. Immutable traces accumulate into persistent knowledge;
knowledge proposes a versioned skill; an independent evaluation gate either promotes
the candidate or returns its outcome to the evidence base. This is an editorial
synthesis, not a result reported by either source. ([WikiSkill](https://arxiv.org/abs/2608.27454),
[Harbor results and artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)).*

**Attribution convention.** Substantive prose ends with primary public sources wherever
possible. Two links at a paragraph end indicate the evidence basis, not necessarily two
independent replications. Editorial taxonomies, reconstructions, and recommendations are
identified as synthesis; framework capability rows link to their official documentation
or repositories. ([Agent Skills specification](https://agentskills.io/specification),
[Harness-Bench](https://arxiv.org/abs/2605.27922)).

## Executive decision

For open and reproducible evaluation of complete skill directories, the strongest
ready-made default is the following composition. This is a recommendation, not a vendor
benchmark result. ([NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports),
[Harbor evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals)).

1. **NVIDIA SkillEvaluator** for skill-native static checks, safety scanning,
   duplication analysis, and paired live trials that report the incremental **Skill
   Lift** of a skill.
2. **Harbor** underneath those live trials—or directly when a custom task world is
   required—for isolated execution, skill provenance, and trial artifacts.
3. **Executable task checks plus calibrated semantic review** for scoring.
4. **Disjoint discovery, development, validation, and holdout cohorts** for controlling
   adaptive overfitting.
5. **MLflow or Langfuse** when long-lived experiment tracking, production traces, and
   feedback are required.
6. **An independent promotion gate** that can reject a candidate even when its mean
   reward, cost, or token count improves.

This default composes a skill-native evaluator with a stateful runner because neither
layer alone supplies treatment isolation, realistic execution, evidence retention, and
promotion governance. ([NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports),
[Harbor evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals)).

Use **Inspect AI** instead of Harbor when custom evaluation programs, solver
composition, safety controls, rescoring, or heterogeneous sandbox backends matter more
than first-class `SKILL.md` handling. Use the **AWS sample skill-eval** as a lightweight
CI starter; **Promptfoo** for provider matrices, assertions, and red teaming;
**DeepEval** for Python test ergonomics and agent-path metrics; **Ragas** for
retrieval-centered systems; and **Pydantic Evals** for typed Python functions and span
assertions. ([Inspect AI](https://inspect.aisi.org.uk/),
[Pydantic Evals](https://ai.pydantic.dev/evals/)).

No single product is the complete system. A credible skill-evolution program combines
an execution layer, an evidence layer, and a promotion layer. This three-layer framing is
the report's synthesis of task execution, experiment evidence, and adaptive-data
governance. ([Harbor results and artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts),
[Reusable Holdout](https://arxiv.org/abs/1506.02629)).

## 1. Define the treatment before choosing a framework

Four objects are often called a "harness," but they answer different questions. The
taxonomy below is a working synthesis, not a universal standard. ([Agent Skills
specification](https://agentskills.io/specification),
[Harness-Bench](https://arxiv.org/abs/2605.27922)).

![Editorial treatment boundary for model, agent harness, skill, and evaluation](assets/modern-skill-evaluation/treatment-boundary-editorial-colorset2-v1.png)

*Figure 1. Editorial reconstruction: **SKILL** is the treatment; **MODEL**, **HARNESS**,
and **EVALUATION** are frozen. Exact definitions follow. ([Agent Skills
specification](https://agentskills.io/specification),
[Harness-Bench](https://arxiv.org/abs/2605.27922)).*

[Formal RoadRails SVG](assets/modern-skill-evaluation/definition-railroads.static.svg) | [Animated SVG](assets/modern-skill-evaluation/definition-railroads.animated.svg) | [Mermaid source](assets/modern-skill-evaluation/definition-railroads.mmd)

| Artifact | Operational definition used in this report | Control in a skill evaluation | Source basis |
| --- | --- | --- | --- |
| **Model** | Parameterized predictor plus decoding and context-window settings | Freeze the model identity, endpoint/version, context limit, and decoding settings | [Harness-Bench](https://arxiv.org/abs/2605.27922); [HELM](https://arxiv.org/abs/2211.09110) |
| **Agent harness** | Execution layer that manages context, tools, state, constraints, permissions, tracing, verification, and recovery around the model | Freeze the harness commit, configuration, tool policy, permissions, and resource envelope | [Harness-Bench](https://arxiv.org/abs/2605.27922); [Inspect AI](https://inspect.aisi.org.uk/) |
| **Skill** | Versioned directory rooted in `SKILL.md`, with optional scripts, references, and assets | Vary the complete directory as the declared treatment and record its digest | [Agent Skills specification](https://agentskills.io/specification); [Harbor skill configuration](https://www.harborframework.com/docs/run-jobs/skills) |
| **Evaluation protocol** | Versioned tasks, task worlds, scorers, repetitions, budgets, evidence policy, and promotion rule | Freeze task and grader identities, split roles, retry policy, and release gate | [Harbor evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals); [Reusable Holdout](https://arxiv.org/abs/1506.02629) |

In a skill evaluation, the **skill is the declared treatment**. The model, agent
harness, task version, resource policy, and graders must be frozen or their changes must
be modeled explicitly. A run that changes all four objects can describe a product
snapshot, but it cannot attribute causality to the skill. ([Harness-Bench](https://arxiv.org/abs/2605.27922),
[NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports)).

The complete skill directory must receive an immutable identity. Digest only the
`SKILL.md` file and an optimizer can silently change a helper script, reference, or
asset without changing the recorded treatment. ([Agent Skills specification](https://agentskills.io/specification),
[Harbor skill configuration](https://www.harborframework.com/docs/run-jobs/skills)).

## 2. How evaluation reached the skill era

The history is cumulative. Each stage retained earlier controls and added a new unit of
observation. The sequence is an editorial synthesis of benchmark, evaluation-library,
agent-runtime, and skill-evolution milestones. ([HELM](https://arxiv.org/abs/2211.09110),
[NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator)).

![Evolution from static benchmarks to skill evolution](assets/modern-skill-evaluation/evaluation-evolution.static.svg)

*Figure 2. Each generation adds a new observable or control while retaining the useful
components of earlier systems. Icons identify the new unit; the matrix makes persistence
across generations explicit. The figure is a synthesis rather than a chronology claimed
by either source. ([AgentBench](https://arxiv.org/abs/2308.03688),
[Trace2Skill](https://arxiv.org/abs/2603.25158)).*

[D3 authoring source](assets/modern-skill-evaluation/evaluation-evolution.html)

### 2.1 Static benchmarks established comparability

A frozen test set and metric made systems comparable, but usually observed only a
final answer. Experiment trackers such as [MLflow](https://github.com/mlflow/mlflow)
made configurations, runs, datasets, and artifacts durable. That provenance remains
foundational. ([MLflow datasets](https://mlflow.org/docs/latest/genai/datasets/),
[HELM](https://arxiv.org/abs/2211.09110)).

### 2.2 Holistic evaluation replaced one score with a profile

[HELM](https://arxiv.org/abs/2211.09110) standardized scenarios, exposed raw model
outputs, and evaluated several qualities rather than treating accuracy as sufficient.
The result was a measurement profile: capability alongside robustness, calibration,
fairness, efficiency, and other constraints. ([HELM](https://arxiv.org/abs/2211.09110),
[OpenAI Evals](https://github.com/openai/evals)).

### 2.3 Evals as code made evaluation part of delivery

[OpenAI Evals](https://github.com/openai/evals) helped normalize versioned datasets,
programmable graders, and model-graded checks. These systems are excellent when the
natural unit is a response. They do not automatically create a realistic terminal,
repository, browser, or other stateful world. ([OpenAI Evals](https://github.com/openai/evals),
[Harbor evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals)).

### 2.4 Agent benchmarks made trajectories observable

[AgentBench](https://arxiv.org/abs/2308.03688) ([paper](https://arxiv.org/pdf/2308.03688))
evaluated agents in interactive environments. [SWE-bench](https://arxiv.org/abs/2310.06770)
([paper](https://arxiv.org/pdf/2310.06770)) connected natural-language issues to real
repositories and executable tests. The agent now had to inspect state, select tools,
modify artifacts, and survive a multi-step loop. ([AgentBench](https://arxiv.org/abs/2308.03688),
[SWE-bench](https://arxiv.org/abs/2310.06770)).

### 2.5 Isolated task worlds made complete work verifiable

[Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868)
([paper](https://arxiv.org/pdf/2601.11868)) packages realistic terminal tasks with
task-specific environments and tests. [Harbor](https://www.harborframework.com/docs)
([repository](https://github.com/harbor-framework/harbor)) generalizes this style of
execution into an agent and model evaluation framework. Harbor is documented as a
framework rather than by a canonical Harbor-framework paper; similarly named HARBOR
papers describe different systems. The environment becomes part of the experimental
boundary, not background plumbing. ([Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868),
[Harbor](https://github.com/harbor-framework/harbor)).

This distinction is measurable. Anthropic reported a six-percentage-point spread
between its least- and most-resourced Terminal-Bench 2.0 configurations, with
`p < 0.01`. Small leaderboard gaps can therefore be infrastructure effects rather than
agent improvements. ([Anthropic infrastructure-noise study](https://www.anthropic.com/engineering/infrastructure-noise),
[Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868)).

### 2.6 Trace-guided optimizers turned failures into candidates

[DSPy](https://arxiv.org/abs/2310.03714) treats LM programs as optimizable artifacts.
[GEPA](https://arxiv.org/abs/2507.19457) reflects on execution evidence, proposes
textual changes, and keeps complementary candidates on a Pareto frontier.
[Trace2Skill](https://arxiv.org/abs/2603.25158) distills trajectory-local lessons into
transferable skill directories. ([GEPA](https://arxiv.org/abs/2507.19457),
[Trace2Skill](https://arxiv.org/abs/2603.25158)).

An optimizer does not reduce the need for evaluation. It increases it. Repeatedly
searching against visible feedback creates selection bias, which is why the final
promotion evidence must come from a sealed cohort that the optimizer did not inspect.
([GEPA](https://arxiv.org/abs/2507.19457),
[Reusable Holdout](https://arxiv.org/abs/1506.02629)).

### 2.7 Skill-native evaluation isolated the value of the skill

The [ACES paper](https://arxiv.org/abs/2608.20614) and its open-source
[NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) implementation make
the skill itself the first-class evaluation target. Deterministic structure and safety
checks are followed by paired live trials with and without the skill under the same
task, model, harness, workspace, and scorer. The resulting **Skill Lift** estimates the
skill's incremental contribution instead of reporting only total agent capability.
([ACES](https://arxiv.org/abs/2608.20614),
[NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports)).

This paired design is the decisive methodological advance for skill evaluation. A good
agent score does not prove that the skill helped; only a controlled no-skill/with-skill
comparison can make that attribution. ([NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator),
[framework-at-scale study](https://arxiv.org/abs/2606.17819)).

### 2.8 Persistent knowledge turned discarded trials into cumulative evidence

[WikiSkill](https://arxiv.org/abs/2608.27454), a Google Research and Virginia Tech
preprint submitted on 2026-08-27, adds a durable learning layer between execution traces
and executable skills. Its workspace separates an immutable **Raw Layer**, a persistent
**Wiki Layer**, and a gated **Skills Layer**. A Wiki Maintainer consolidates failure
patterns, successful strategies, proposal history, and validation outcomes. A Skill
Proposer uses that accumulated knowledge plus recent traces to produce candidates.
Validation can roll a skill back, but it does not roll the wiki back.
([WikiSkill](https://arxiv.org/abs/2608.27454),
[Google Research ReasoningBank](https://research.google/blog/reasoningbank-enabling-agents-to-learn-from-experience/)).

![WikiSkill separates immutable evidence, persistent knowledge, and executable skills](assets/modern-skill-evaluation/wikiskill-loop.static.svg)

*Figure 3. Original reconstruction of the control flow in WikiSkill Figure 2. Immutable
traces feed a persistent wiki; the proposer converts accumulated knowledge into gated
skills; and the inference agent receives active skills but never the wiki itself. The
paper is the source for this topology; ReasoningBank supplies adjacent Google Research
context for persistent experience. ([WikiSkill](https://arxiv.org/abs/2608.27454),
[ReasoningBank](https://research.google/blog/reasoningbank-enabling-agents-to-learn-from-experience/)).*
[Animated SVG](assets/modern-skill-evaluation/wikiskill-loop.animated.svg) | [Mermaid source](assets/modern-skill-evaluation/wikiskill-loop.mmd)

The separation is empirically consequential within the paper's protocol. In a
four-benchmark Gemini-3.5-Flash ablation, giving the Skill Proposer wiki access while
withholding it from the Inference Agent raised the reported average from **48.7% to
63.7%**. Giving the Inference Agent wiki access during training reduced that result to
**60.9%**. The paper also reports that evolved skills can transfer across models and
sometimes outperform self-evolved skills. This distinguishes the ability to **discover
procedural knowledge** from the ability to **execute it**. ([WikiSkill abstract and
record](https://arxiv.org/abs/2608.27454),
[WikiSkill paper PDF](https://arxiv.org/pdf/2608.27454)).

WikiSkill should currently be treated as a research design, not a drop-in open-source
evaluation framework. The study directly injects active skills, so it does not evaluate
skill retrieval or triggering; validation accepts only immediately improving proposals;
the wiki has no automated pruning mechanism; and the arXiv record does not link a public
implementation or code license as of 2026-08-30. ([WikiSkill](https://arxiv.org/abs/2608.27454),
[Agent Skills specification](https://agentskills.io/specification)).

## 3. The architecture of a modern skill evaluation

![Editorial architecture of a controlled skill evaluation](assets/modern-skill-evaluation/evaluation-system-editorial-colorset2-v1.png)

*Figure 4. ImageGen-assisted editorial reconstruction of the controlled evaluation
flow. The image is explanatory: the table below is the exact semantic contract. A study
freezes identities, runs baseline and candidate in equivalent task worlds, records
evidence, grades in layers, and promotes only through an independent gate. ([Harbor
evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals),
[Reusable Holdout](https://arxiv.org/abs/1506.02629)).*

[PlantUML C4 source](assets/modern-skill-evaluation/evaluation-system-c4.puml)

| Layer | Exact responsibility | Boundary that must remain explicit | Source basis |
| --- | --- | --- | --- |
| **Execution** | Freeze model, harness, task, environment, graders, resources, and baseline; build an isolated candidate; run paired baseline/candidate trials | Only the complete skill bundle varies as treatment | [Harness-Bench](https://arxiv.org/abs/2605.27922); [Harbor skill configuration](https://www.harborframework.com/docs/run-jobs/skills) |
| **Evidence** | Preserve outcomes, trajectories, artifacts, errors, time, tokens, and cost; apply deterministic checks before semantic judgment | Raw evidence is immutable; regrading creates a new evaluation view rather than rewriting execution | [Harbor results and artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts); [Harbor regrading](https://www.harborframework.com/docs/run-jobs/regrade) |
| **Promotion** | Filter on validation, release the sealed holdout once, enforce hard gates and uncertainty rules, then approve or reject independently | Candidate generation cannot inspect holdout evidence or control release authority | [Reusable Holdout](https://arxiv.org/abs/1506.02629); [GEPA](https://arxiv.org/abs/2507.19457) |

A credible system has ten pillars. The list is this report's synthesis of open skill
packaging, realistic agent execution, layered evaluation, experiment provenance, and
adaptive-data controls. ([Agent Skills specification](https://agentskills.io/specification),
[Harness-Bench](https://arxiv.org/abs/2605.27922)).

1. **One declared treatment.** Vary the skill while freezing the model, agent harness,
   task version, environment, resources, and graders.
2. **Realistic isolated tasks.** Evaluate the work the skill is intended to improve.
   Repository skills need repositories and tests; browser skills need browser state;
   RAG skills need a controlled evidence corpus.
3. **Immutable identity.** Digest the complete skill bundle, task, image, verifier,
   dataset manifest, model settings, and harness commit.
4. **Layered scoring.** Prefer deterministic checks for observable outcomes. Add model
   or human judgment only where correctness cannot be encoded completely.
5. **Disjoint data roles.** Separate discovery, development, validation, and holdout.
   Once inspected, a holdout becomes development data for the next generation.
6. **Trajectory evidence.** Preserve messages, tool calls, state transitions, produced
   artifacts, verifier output, time, tokens, and cost.
7. **Hard gates plus tradeoffs.** Correctness, safety, and semantic quality are gates.
   Cost, latency, and token use can be Pareto objectives.
8. **Uncertainty and pairing.** Pair baseline and candidate on the same tasks and seeds
   when possible. Use repeated runs or paired resampling when stochasticity matters.
9. **Failure taxonomy.** Separate semantic failure from provider, infrastructure,
   evaluator, authentication, and environment failure. Never retry meaning until it
   passes and then count only the success.
10. **Independent promotion.** Keep the mutator, executor, evaluator, selector, and
    release authority conceptually separate.

The [Reusable Holdout](https://arxiv.org/abs/1506.02629) formalizes the broader problem:
adaptive reuse of evaluation data can overfit the evaluation itself. Agent and skill
optimizers make this risk operational rather than theoretical. ([Reusable
Holdout](https://arxiv.org/abs/1506.02629),
[GEPA](https://arxiv.org/abs/2507.19457)).

WikiSkill sharpens the evidence pillar: immutable traces, accumulated learning memory,
and the executable skill should have independent identities. Only the skill is the
test-time treatment. The wiki is optimizer state whose contents and access policy must
be recorded so that a gain is not misattributed to hidden execution context.
([WikiSkill](https://arxiv.org/abs/2608.27454),
[Agent Skills specification](https://agentskills.io/specification)).

## 4. Framework capability landscape

![Capability landscape for skill evaluation frameworks](assets/modern-skill-evaluation/capability-landscape.svg)

*Figure 5. D3-generated ordinal capability map. Color encodes native/first-class,
strong documented, adapter/manual, or outside-center-of-gravity support. Repeated cell
letters were removed for legibility. The figure is a dated documentation synthesis, not
a benchmark score, and row totals are intentionally meaningless. ([NVIDIA
SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator),
[Harbor](https://github.com/harbor-framework/harbor)).*
[D3 authoring source](assets/modern-skill-evaluation/capability-landscape.html)

Each cell was coded from official documentation or the project's primary repository as
of 2026-08-30. Categories are ordinal judgments about center of gravity, not measured
performance; the tables below expose the underlying rationale and caveats. ([Inspect
AI](https://inspect.aisi.org.uk/), [Pydantic Evals](https://ai.pydantic.dev/evals/)).

### 4.1 Dedicated skill evaluators

| Framework | Native center of gravity | Skill-evaluation advantage | Critical caveat |
| --- | --- | --- | --- |
| [NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Tier 1 deterministic structure, safety, and script checks; Tier 2 similarity and deduplication; Tier 3 live paired trials through Harbor | Treats directories as first-class artifacts and compares no-skill with with-skill runs under a fixed protocol; reports triggering, behavior, cost, and Skill Lift | Young project; live trials still require a provider, agent runtime, task workspace, sandbox, and reviewed task generation |
| [AWS sample skill-eval](https://github.com/aws-samples/sample-agent-skill-eval) | Lightweight safety, quality, reliability, and cost checks | Small MIT-0 starter that is easy to place in authoring or CI workflows | Sample implementation rather than a general stateful task runner or mature benchmark ecosystem |
| [SkillTester](https://github.com/skilltester-ai/skilltester) | Paired utility and security probes for skills | Makes baseline-versus-skill comparison and adversarial behavior explicit | Repository has no detected license; source visibility alone does not grant reuse rights |

**Decision:** choose NVIDIA SkillEvaluator when a ready-made, open-source, skill-native
quality gate is the goal. Use the AWS sample for a smaller CI starting point. Treat
SkillTester as a research/service option until its code has an explicit license.
([NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator),
[AWS sample skill-eval](https://github.com/aws-samples/sample-agent-skill-eval)).

The independent [framework-at-scale study](https://arxiv.org/abs/2606.17819) reinforces
the paired design: it evaluated 500 skills, 1,000 generated tasks, and 19 agent-model
configurations, finding that adherence and gains vary materially by runtime. A skill is
therefore not universally “good”; its effect is conditional on the model and harness in
which it executes. ([framework-at-scale study](https://arxiv.org/abs/2606.17819),
[Harness-Bench](https://arxiv.org/abs/2605.27922)).

### 4.2 Task runners

| Framework | Native center of gravity | Skill-evaluation advantage | Critical caveat |
| --- | --- | --- | --- |
| [Harbor](https://github.com/harbor-framework/harbor) | Containerized agent/model trials, task verifiers, artifacts, and optimization | A local or Git skill directory is a first-class input; source, digest, and resolved commit can be locked | Provenance does not create correct dataset splits or an independent promotion policy |
| [Inspect AI](https://inspect.aisi.org.uk/) | Python evaluation programs, solvers, scorers, logs, limits, and multiple sandbox backends | Strong control over custom agents, safety studies, rescoring, and heterogeneous execution | A skill bundle is an experiment convention or adapter rather than the native unit |

**Decision:** choose Harbor when the object being evolved is a complete skill directory
and tasks change a stateful world. Choose Inspect AI when evaluation-program
flexibility, safety controls, or sandbox diversity is the primary requirement.
([Harbor](https://github.com/harbor-framework/harbor),
[Inspect AI](https://inspect.aisi.org.uk/)).

### 4.3 Evaluation libraries

| Framework | Best fit | Evidence and scoring | Skill-evolution limit |
| --- | --- | --- | --- |
| [Promptfoo](https://github.com/promptfoo/promptfoo) | Prompt/provider matrices, CI assertions, and red teaming | Declarative assertions, custom code, model graders, latency, and cost | Provider runtime is not a general isolated task world |
| [OpenAI Evals](https://github.com/openai/evals) | Response datasets and custom graders | Exact, custom, and model-graded evaluation | No general skill bundle or agent sandbox in the OSS runner |
| [DeepEval](https://github.com/confident-ai/deepeval) | Python and pytest workflows, including agent-path evaluation | Task metrics, tool/sub-agent behavior, custom DAGs, and model judges | Prompt optimization is not a generic population search over complete skill directories |
| [Ragas](https://github.com/vibrantlabsai/ragas) | Retrieval, RAG, and context quality | Retrieval/generation metrics plus message and tool evaluation | Pair with a task runner when the agent changes external state |
| [Pydantic Evals](https://ai.pydantic.dev/evals/) | Typed Python applications | Typed evaluators and OpenTelemetry span assertions | Function runtime is not an isolated task-world abstraction |

### 4.4 Lifecycle and observability platforms

| Framework | Best fit | What it adds | What it does not replace |
| --- | --- | --- | --- |
| [MLflow](https://github.com/mlflow/mlflow) | Broad experiment and model lifecycle | Runs, datasets, artifacts, traces, scorers, registry, and production feedback | A clean terminal or browser task world |
| [Langfuse](https://github.com/langfuse/langfuse) | Self-hosted or managed LLM observability | Traces, datasets, experiments, scores, and user feedback | First-class skill locking and holdout governance |
| [Phoenix](https://github.com/Arize-ai/phoenix) | OpenInference/OpenTelemetry tracing and evaluation | Spans, datasets, code/model/human evaluation | OSI-open licensing and isolated task execution |
| [LangSmith](https://docs.langchain.com/langsmith/evaluation) | Managed LangChain-centered evaluation | Datasets, trajectories, pairwise evaluators, online traces, and feedback | An open-source, portable task runner |

These platforms complement a dedicated evaluator and a task runner. They answer how
experiments and production behavior are stored, compared, and monitored; they do not
automatically prove that a candidate skill caused a result. ([MLflow
datasets](https://mlflow.org/docs/latest/genai/datasets/),
[NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports)).

### 4.5 License and community snapshot

GitHub stars and forks are rough adoption signals, not evidence of evaluation validity.
Counts below are a dated snapshot from the GitHub API on **2026-08-30**. Stars and forks
describe repository attention, while licenses govern reuse; neither establishes causal
validity. ([GitHub repository API](https://docs.github.com/en/rest/repos/repos#get-a-repository),
[Open Source Definition](https://opensource.org/osd)).

| Framework | License posture | Stars | Forks | Operational implication |
| --- | --- | ---: | ---: | --- |
| NVIDIA SkillEvaluator | Apache-2.0 | 354 | 34 | Open, dedicated skill-evaluation implementation |
| AWS sample skill-eval | MIT-0 | 14 | 3 | Small, permissive reference implementation |
| SkillTester | No detected repository license | 36 | 2 | Source-visible; seek permission before reuse |
| Harbor | Apache-2.0 | 4,774 | 1,683 | Open task runner and optimization substrate |
| Inspect AI | MIT | 2,663 | 682 | Open Python research and evaluation runtime |
| Promptfoo | MIT | 24,672 | 2,250 | Large JS/TS and CI-oriented community |
| OpenAI Evals repository | MIT code; individual datasets retain their own terms | 19,307 | 3,069 | OSS runner is distinct from proprietary hosted services |
| DeepEval | Apache-2.0 | 17,962 | 1,875 | Python/pytest evaluation ecosystem |
| Ragas | Apache-2.0 | 15,544 | 1,662 | Retrieval and RAG-centered ecosystem |
| Pydantic AI repository | MIT | 19,583 | 2,616 | Count covers the wider repository, including Pydantic Evals |
| Microsoft SkillOpt | MIT | 16,484 | 1,549 | Large early community around skill optimization |
| SkillOps | MIT | 62 | 6 | Early project for typed skill-library operations |
| MLflow | Apache-2.0 | 27,735 | 6,234 | Broad lifecycle and observability platform |
| Langfuse | MIT core; enterprise directories have separate terms | 33,923 | 3,666 | Open core with self-hosting and managed options |
| Phoenix | Elastic License 2.0 | 11,247 | 1,084 | Source available, not OSI open source; hosted-service restrictions apply |
| LangSmith | Proprietary | Not comparable | Not comparable | Managed service and LangChain integration |

“Public on GitHub” is not a license. Without an explicit license, default copyright
applies. Review the [Open Source Definition](https://opensource.org/osd) and the exact
license file before adopting, modifying, or redistributing any framework. ([GitHub
licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository),
[Open Source Definition](https://opensource.org/osd)).

### 4.6 Evolution and library operations are not evaluation frameworks

| Method | Distinctive evolution state | Evaluation it still requires | Adoption posture |
| --- | --- | --- | --- |
| [Microsoft SkillOpt](https://github.com/microsoft/SkillOpt) | Bounded add/delete/replace edits, rejected-edit memory, validation gates, and slow meta-updates | Real task execution, independent splits, calibrated scoring, and an untouched promotion holdout | MIT implementation and [paper](https://arxiv.org/abs/2605.23904) from Microsoft Research |
| [SkillOps](https://github.com/Hik289/SkillOps) | Typed skill contracts plus graph health, merge, repair, retirement, validators, and adapters for skill libraries | Runtime utility, triggering, behavior, safety, and generalization evidence | Separate MIT project from Emory/UIUC; [paper](https://arxiv.org/abs/2605.13716) |
| [GEPA](https://arxiv.org/abs/2507.19457) | Reflective textual proposals plus a Pareto frontier | A task runner, case-level feedback, disjoint validation, and a sealed holdout | Available through open DSPy tooling; integrate with the task world that matches the skill |
| [Trace2Skill](https://arxiv.org/abs/2603.25158) | Trajectory-local lessons consolidated into transferable skill directories | Independent execution and promotion evidence beyond the traces used to distill | Research method; verify the implementation and license selected for use |
| [WikiSkill](https://arxiv.org/abs/2608.27454) | Immutable raw traces, a persistent wiki, proposal impact history, and gated skills | Real task worlds, calibrated graders, holdout governance, and skill-retrieval evaluation | Public preprint; no implementation or code license is linked from the arXiv record as of 2026-08-30 |

**Naming clarification:** **SkillOpt** is Microsoft’s optimizer. **SkillOps** is the
separate Emory/UIUC skill-library project. Microsoft also has an unrelated ACES
cyber-evaluation repository; the **ACES skill-evaluation method** discussed here is the
paper implemented by NVIDIA SkillEvaluator. ([Microsoft
SkillOpt](https://github.com/microsoft/SkillOpt),
[NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator)).

The distinction matters: an optimizer proposes or selects treatments; it does not prove
that they generalize. SkillOpt, SkillOps, GEPA, Trace2Skill, and WikiSkill can sit above
Harbor or Inspect AI, with MLflow or Langfuse preserving lifecycle evidence, but the
evaluator and promotion authority must remain independently specified. ([GEPA](https://arxiv.org/abs/2507.19457),
[Reusable Holdout](https://arxiv.org/abs/1506.02629)).

## 5. Select from the artifact that must be correct

![Decision guide for selecting an evaluation framework](assets/modern-skill-evaluation/selection-guide.static.svg)

*Figure 6. Start with the artifact that must be correct, not with a vendor feature
list. An evolving skill requires response, trajectory, and changed-world evidence. The
decision tree is an editorial synthesis. ([AgentBench](https://arxiv.org/abs/2308.03688),
[Harbor evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals)).*

[Animated SVG](assets/modern-skill-evaluation/selection-guide.animated.svg) | [Mermaid source](assets/modern-skill-evaluation/selection-guide.mmd)

Use these six factors to select or compose the stack. They operationalize treatment
identity, environmental realism, scoring, evidence, governance, and adoption constraints.
([Harness-Bench](https://arxiv.org/abs/2605.27922),
[ATAM collection](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/)).

### 5.1 Treatment boundary

- Can the framework identify the complete skill directory by digest and source commit?
- Can it keep the model and harness constant while injecting baseline and candidate?
- Can it preserve parent-child lineage across generations?

### 5.2 World fidelity

- Is the task answer-only, function-level, terminal-based, repository-based,
  browser-based, or multi-agent?
- Can CPU, RAM, time, network, images, credentials, and external services be pinned?
- Does the final verifier inspect the changed world rather than trusting the agent's
  final message?

### 5.3 Grader strength

- Are executable checks available for outcomes that can be observed directly?
- Does semantic review cite the evidence it used?
- Has any model judge been calibrated against blinded human review?
- Can old logs be rescored when the rubric changes?

### 5.4 Evidence and statistics

- Are trajectories, artifacts, verifier output, errors, time, tokens, and cost retained?
- Are baseline and candidate paired by task and seed?
- Are counts, effect sizes or intervals, and worst-domain cells reported?
- Are missing trials and infrastructure failures visible rather than silently dropped?

### 5.5 Optimization and governance

- Is the search budget fixed before results are known?
- Are discovery, development, validation, and holdout identities disjoint?
- Can a hard gate reject a lower-cost or higher-mean candidate?
- Is holdout release one-way and promotion independently reviewed?

### 5.6 Deployment, license, and ecosystem

- Can the system run locally, air-gapped, in CI, or in the required cloud?
- Is the license compatible with internal modification, redistribution, and hosted use?
- Does the community maintain adapters for the models, sandboxes, and telemetry stack
  already in use?
- What is the exit strategy for datasets, traces, scorers, and candidate bundles?

## 6. Promotion protocol for evolving a skill

![Controlled promotion loop for skill evolution](assets/modern-skill-evaluation/promotion-loop.static.svg)

*Figure 7. Visible feedback is restricted to development. Validation filters finalists;
the sealed holdout decides whether a candidate may replace the baseline. The loop is a
governance synthesis grounded in adaptive holdout control and evaluation-guided search.
([Reusable Holdout](https://arxiv.org/abs/1506.02629),
[GEPA](https://arxiv.org/abs/2507.19457)).*

[Animated SVG](assets/modern-skill-evaluation/promotion-loop.animated.svg) | [Mermaid source](assets/modern-skill-evaluation/promotion-loop.mmd)

### Stage 1: Freeze the study

Record task manifests, split membership, model and decoding, harness commit, container
digests, resource policy, verifier and rubric digests, baseline skill digest, retry
policy, budgets, and promotion rules before evaluating a candidate. ([Harness-Bench](https://arxiv.org/abs/2605.27922),
[Harbor evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals)).

### Stage 2: Discover representative failures

Run the frozen baseline. Preserve case-level rewards, trajectories, produced artifacts,
verifier diagnostics, and failure classes. Discovery evidence identifies mutation
hypotheses; it does not establish generalization. ([Harbor results and
artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts),
[Trace2Skill](https://arxiv.org/abs/2603.25158)).

### Stage 3: Search within a fixed budget

Generate candidates with GEPA, trace distillation, Pareto search, operator coevolution,
or human review. The optimizer may inspect only the cohorts assigned to development.
Keep every candidate's complete bundle and parent lineage. ([GEPA](https://arxiv.org/abs/2507.19457),
[SkillOpt](https://arxiv.org/abs/2605.23904)).

### Stage 4: Validate hard constraints

Use validation to reject unsafe, semantically weak, or domain-regressing candidates.
Do not compensate for a critical regression with an unrelated gain in cost or mean
reward. ([NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator),
[ATAM collection](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/)).

### Stage 5: Release the sealed holdout once

Compare the finalist with the frozen baseline on identical unseen tasks. Pair runs when
possible, report uncertainty, and show every task cell. After release, retire that
holdout from future promotion claims. ([Reusable Holdout](https://arxiv.org/abs/1506.02629),
[NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports)).

### Stage 6: Promote independently

Promotion should require all hard gates, no prohibited subgroup regression, acceptable
uncertainty, valid lineage, and reviewer approval. The new winner becomes the next
frozen baseline; rejected candidates remain useful evidence. ([SkillOpt](https://arxiv.org/abs/2605.23904),
[WikiSkill](https://arxiv.org/abs/2608.27454)).

## 7. Lessons from the local Harbor evolution program

The local work is valuable because it records non-promotions rather than presenting
only winners. ([Skill Arena comparison](https://github.com/mvk-001/skill-arena/blob/main/evaluations/harbor-evolution-comparison/results/20260716/report.md),
[Knowledge evaluation index](https://github.com/gvillarroel/knowledge/blob/main/evaluations/SKILL-EXPLORATION-AND-EVOLUTION.md)).

The frozen [Skill Arena Harbor comparison](https://github.com/mvk-001/skill-arena/blob/main/evaluations/harbor-evolution-comparison/results/20260716/report.md)
contains **24 Harbor jobs and 78 trials** across development and holdout, with no
recorded errors or retries. Trace distillation and reflective Pareto search tied for the
strongest selected holdout mean. That is evidence for those tasks and budgets, not a
universal ranking of optimizers. ([Skill Arena comparison](https://github.com/mvk-001/skill-arena/blob/main/evaluations/harbor-evolution-comparison/results/20260716/report.md),
[Harbor results and artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)).

The [Knowledge skill-evolution index](https://github.com/gvillarroel/knowledge/blob/main/evaluations/SKILL-EXPLORATION-AND-EVOLUTION.md)
shows three failure modes that a mean score would miss. ([Knowledge evaluation
index](https://github.com/gvillarroel/knowledge/blob/main/evaluations/SKILL-EXPLORATION-AND-EVOLUTION.md),
[Reusable Holdout](https://arxiv.org/abs/1506.02629)).

- A candidate won both development datasets and the mean holdout, but regressed one
  critical holdout cell. A zero-regression rule retained the baseline.
- A candidate passed all four development trials and then failed to qualify on the
  two-question holdout.
- A token-optimized candidate reduced recorded tokens by **98.674426%** and passed its
  numeric thresholds, but independent semantic review found regressions in four of six
  cases. It was rejected.

The conclusion is not that optimization is unreliable. It is that development selects
what deserves scrutiny while holdout evidence decides what may be promoted. ([Knowledge
evaluation index](https://github.com/gvillarroel/knowledge/blob/main/evaluations/SKILL-EXPLORATION-AND-EVOLUTION.md),
[Reusable Holdout](https://arxiv.org/abs/1506.02629)).

Both supporting repositories and the reports cited above are public. No private
knowledge-corpus text, retrieval output, or unpublished evaluation artifact is copied
into this report. ([Skill Arena](https://github.com/mvk-001/skill-arena),
[Knowledge evaluation index](https://github.com/gvillarroel/knowledge/blob/main/evaluations/SKILL-EXPLORATION-AND-EVOLUTION.md)).

## 8. Recommended reference stacks

| Workload | Execution and evaluation | Lifecycle evidence | Candidate generation |
| --- | --- | --- | --- |
| Dedicated authoring-time and CI quality gate for a skill directory | NVIDIA SkillEvaluator; Harbor for Tier 3 paired execution | Native reports, optionally MLflow or Langfuse | SkillOpt, GEPA, trace distillation, or a bounded custom mutator |
| Coding, terminal, data transformation, artifact production | NVIDIA SkillEvaluator over Harbor, or direct Harbor for a bespoke evaluator | MLflow or Langfuse when needed | SkillOpt, Harbor GEPA, trace distillation, Pareto search, or a bounded custom mutator |
| Safety studies, custom loops, multi-agent research | Inspect AI with selected sandbox backend | MLflow, Langfuse, Phoenix, or LangSmith | External optimizer with explicit skill identity |
| Provider and prompt CI, red teaming | Promptfoo | Native reports or lifecycle platform | Matrix search or external optimizer |
| Python application and agent tests | DeepEval or Pydantic Evals | OpenTelemetry-compatible platform | Prompt optimizer or external skill mutator |
| RAG and retrieval systems | Ragas plus Harbor or Inspect when external state changes | MLflow, Langfuse, Phoenix, or LangSmith | Retrieval/prompt optimizer with sealed corpus holdout |

For the central use case in this report, the practical default below is a composition
judgment, not a vendor benchmark result. It
prioritizes complete-skill identity, paired lift, realistic stateful execution, layered
grading, sealed holdout evidence, and independent promotion. ([NVIDIA SkillEvaluator
reports](https://docs.nvidia.com/skills/skillevaluator/reports),
[Harbor evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals)).

> **NVIDIA SkillEvaluator for the ready-made skill gate + Harbor for isolated paired
> execution + deterministic tests and calibrated semantic review for scoring + a sealed
> holdout and independent reviewer for promotion.** Use Harbor directly when the task
> world or evaluator must be bespoke. ([NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator),
> [Harbor](https://github.com/harbor-framework/harbor)).

## 9. Final review checklist

Before calling a candidate skill better, verify all of the following. The checklist
turns the report's treatment, evidence, and promotion controls into reviewable release
criteria. ([NVIDIA SkillEvaluator reports](https://docs.nvidia.com/skills/skillevaluator/reports),
[Reusable Holdout](https://arxiv.org/abs/1506.02629)).

- [ ] The complete baseline and candidate skill bundles have different, recorded
      digests.
- [ ] A paired no-skill/with-skill condition isolates Skill Lift from total agent
      capability whenever the research question is whether the skill helped.
- [ ] Model, harness, task, environment, resource, verifier, and rubric identities are
      frozen.
- [ ] Discovery, development, validation, and holdout manifests are disjoint.
- [ ] The optimizer never received holdout prompts, labels, rewards, or traces.
- [ ] Semantic failures were not retried until they passed.
- [ ] Infrastructure recovery retained the original attempt and exact provenance.
- [ ] Raw traces, accumulated knowledge, and the executable skill have separate
      identities and access policies.
- [ ] Rejected candidate outcomes remain available to the optimizer without entering
      the test-time context.
- [ ] Every promoted claim includes task-level baseline and candidate results.
- [ ] Uncertainty is reported when sampling or model behavior is stochastic.
- [ ] Worst-domain and safety gates pass; the mean does not conceal a critical
      regression.
- [ ] Licensing permits the intended modification, redistribution, and deployment.
- [ ] An authority independent from candidate generation approved promotion.

## References

- Carnegie Mellon Software Engineering Institute. [Architecture Tradeoff Analysis Method collection](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/).
- Agent Skills. [Open specification for reusable agent skills](https://agentskills.io/specification).
- Yao et al. [Harness-Bench: Measuring Harness Effects across Models in Realistic Agent Workflows](https://arxiv.org/abs/2605.27922).
- Liang et al. [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110).
- OpenAI. [OpenAI Evals repository](https://github.com/openai/evals) and [Evals API reference](https://platform.openai.com/docs/api-reference/evals).
- Liu et al. [AgentBench: Evaluating LLMs as Agents](https://arxiv.org/abs/2308.03688).
- Jimenez et al. [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770).
- The Terminal-Bench team. [Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces](https://arxiv.org/abs/2601.11868).
- Anthropic. [Quantifying infrastructure noise in agentic coding evals](https://www.anthropic.com/engineering/infrastructure-noise).
- Harbor. [Documentation](https://www.harborframework.com/docs), [skill configuration](https://www.harborframework.com/docs/run-jobs/skills), [evaluation runs](https://www.harborframework.com/docs/run-jobs/run-evals), [results and artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts), [regrading](https://www.harborframework.com/docs/run-jobs/regrade), and [repository](https://github.com/harbor-framework/harbor).
- Kevin et al. [Evaluating Skills, Not Just Agents: Agentic Continuous Evaluation of Skills](https://arxiv.org/abs/2608.20614), [NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator), and [report semantics](https://docs.nvidia.com/skills/skillevaluator/reports).
- Shaposhnikov et al. [A Framework for Evaluating Agentic Skills at Scale](https://arxiv.org/abs/2606.17819).
- AWS Samples. [Agent skill evaluation sample](https://github.com/aws-samples/sample-agent-skill-eval).
- SkillTester. [Paper](https://arxiv.org/abs/2603.28815) and [repository](https://github.com/skilltester-ai/skilltester).
- UK AI Security Institute. [Inspect AI documentation](https://inspect.aisi.org.uk/) and [repository](https://github.com/UKGovernmentBEIS/inspect_ai).
- Promptfoo. [Repository](https://github.com/promptfoo/promptfoo).
- DeepEval. [Repository](https://github.com/confident-ai/deepeval).
- Ragas. [Repository](https://github.com/vibrantlabsai/ragas).
- Pydantic. [Pydantic Evals documentation](https://ai.pydantic.dev/evals/).
- MLflow. [Repository](https://github.com/mlflow/mlflow) and [GenAI datasets](https://mlflow.org/docs/latest/genai/datasets/).
- Langfuse. [Repository and license](https://github.com/langfuse/langfuse/blob/main/LICENSE).
- Arize AI. [Phoenix repository](https://github.com/Arize-ai/phoenix) and [Elastic License 2.0](https://github.com/Arize-ai/phoenix/blob/main/LICENSE).
- LangChain. [LangSmith evaluation documentation](https://docs.langchain.com/langsmith/evaluation).
- Khattab et al. [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines](https://arxiv.org/abs/2310.03714).
- Agrawal et al. [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning](https://arxiv.org/abs/2507.19457).
- Qian et al. [Trace2Skill: Distill Trajectory-Local Lessons into Transferable Agent Skills](https://arxiv.org/abs/2603.25158).
- Yang et al. [SkillOpt: Executive Strategy for Self-Evolving Agent Skills](https://arxiv.org/abs/2605.23904), [Microsoft Research overview](https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/), and [repository](https://github.com/microsoft/SkillOpt).
- Song et al. [SkillOps: Towards Automated Skill Library Management](https://arxiv.org/abs/2605.13716) and [repository](https://github.com/Hik289/SkillOps).
- Tang et al. [WikiSkill: Compiling Agent Experience into Persistent Knowledge for Skill Evolution](https://arxiv.org/abs/2608.27454) ([paper PDF](https://arxiv.org/pdf/2608.27454)); Google Research, [ReasoningBank](https://research.google/blog/reasoningbank-enabling-agents-to-learn-from-experience/).
- Dwork et al. [The Reusable Holdout: Preserving Validity in Adaptive Data Analysis](https://arxiv.org/abs/1506.02629).
- Skill Arena. [Harbor skill evolution repository](https://github.com/mvk-001/skill-arena) and [frozen comparison report](https://github.com/mvk-001/skill-arena/blob/main/evaluations/harbor-evolution-comparison/results/20260716/report.md).
- Knowledge. [Skill exploration and evolution index](https://github.com/gvillarroel/knowledge/blob/main/evaluations/SKILL-EXPLORATION-AND-EVOLUTION.md).
- GitHub. [Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) and [repository API](https://docs.github.com/en/rest/repos/repos#get-a-repository).
- Open Source Initiative. [The Open Source Definition](https://opensource.org/osd).

---

**Bottom line:** skill evolution is experimental software engineering. The optimizer
may be creative. The evaluator must be versioned, skeptical, independently governed,
and difficult to game. ([Reusable Holdout](https://arxiv.org/abs/1506.02629),
[Harness-Bench](https://arxiv.org/abs/2605.27922)).
