# Curated papers: Graphs and AI

This catalog contains **109** papers and open academic references retained at
the **2026-08-14** cutoff: **39 current-year papers** and **70 prior-year
anchors**. Every entry links to its canonical arXiv record and PDF. The
selection and exclusion rules are documented in [screening.md](screening.md).

`Anchor` denotes foundational, peer-reviewed, independently influential, or
widely reproduced work. `Current-strong` denotes a 2026 paper with a substantial
benchmark, controlled comparison, formal result, diagnostic contribution, or
reproducible artifact; many of these remain unreviewed preprints and should not
be treated as settled evidence.

## Trusted primary references

These five maintained primary sources complement the paper snapshot and are
also registered in the local domain:

- [TransE at NeurIPS 2013](https://proceedings.neurips.cc/paper_files/paper/2013/hash/1cecc7a77928ca8133fa24680a88d2f9-Abstract.html) — Official paper, reviews, and PDF for a foundational result without a canonical arXiv entry.
- [NetworkX documentation](https://networkx.org/documentation/stable/) — Definitions and reference implementations for graph structures and algorithms.
- [Open Graph Benchmark](https://ogb.stanford.edu/) — Official datasets, splits, evaluators, leaderboards, and rules.
- [PyTorch Geometric documentation](https://pytorch-geometric.readthedocs.io/en/latest/) — Current graph-learning implementation and data-pipeline reference.
- [Microsoft GraphRAG documentation](https://microsoft.github.io/graphrag/) — Official indexing, query, configuration, and versioning documentation.

## Mathematical and conceptual foundations

- **Anchor** — [An introduction to graph theory](https://arxiv.org/abs/2308.04512) ([PDF](https://arxiv.org/pdf/2308.04512)) — Open graduate-level graph-theory reference with broad theorem coverage.
- **Anchor** — [Relational inductive biases, deep learning, and graph networks](https://arxiv.org/abs/1806.01261) ([PDF](https://arxiv.org/pdf/1806.01261)) — Foundational synthesis connecting relational structure and neural architectures.
- **Anchor** — [A Comprehensive Survey on Graph Neural Networks](https://arxiv.org/abs/1901.00596) ([PDF](https://arxiv.org/pdf/1901.00596)) — Peer-reviewed field map and durable taxonomy of GNN methods.
- **Anchor** — [Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges](https://arxiv.org/abs/2104.13478) ([PDF](https://arxiv.org/pdf/2104.13478)) — Unifying geometric framework for graph and non-Euclidean deep learning.

## Graph representation learning

- **Anchor** — [DeepWalk: Online Learning of Social Representations](https://arxiv.org/abs/1403.6652) ([PDF](https://arxiv.org/pdf/1403.6652)) — Seminal random-walk representation-learning method.
- **Anchor** — [node2vec: Scalable Feature Learning for Networks](https://arxiv.org/abs/1607.00653) ([PDF](https://arxiv.org/pdf/1607.00653)) — Influential controllable random-walk embedding method.
- **Anchor** — [Semi-Supervised Classification with Graph Convolutional Networks](https://arxiv.org/abs/1609.02907) ([PDF](https://arxiv.org/pdf/1609.02907)) — Canonical graph convolutional network formulation.
- **Anchor** — [Inductive Representation Learning on Large Graphs](https://arxiv.org/abs/1706.02216) ([PDF](https://arxiv.org/pdf/1706.02216)) — Introduced GraphSAGE and inductive neighborhood aggregation.
- **Anchor** — [Graph Attention Networks](https://arxiv.org/abs/1710.10903) ([PDF](https://arxiv.org/pdf/1710.10903)) — Canonical attention-based graph message passing.
- **Anchor** — [How Powerful are Graph Neural Networks?](https://arxiv.org/abs/1810.00826) ([PDF](https://arxiv.org/pdf/1810.00826)) — Core expressivity result and Graph Isomorphism Network.
- **Anchor** — [Weisfeiler and Leman Go Neural: Higher-order Graph Neural Networks](https://arxiv.org/abs/1810.02244) ([PDF](https://arxiv.org/pdf/1810.02244)) — Higher-order expressivity grounded in Weisfeiler-Leman tests.
- **Anchor** — [Variational Graph Auto-Encoders](https://arxiv.org/abs/1611.07308) ([PDF](https://arxiv.org/pdf/1611.07308)) — Foundational probabilistic graph autoencoder.
- **Anchor** — [Deep Graph Infomax](https://arxiv.org/abs/1809.10341) ([PDF](https://arxiv.org/pdf/1809.10341)) — Influential mutual-information self-supervision for graphs.
- **Anchor** — [Graph Contrastive Learning with Augmentations](https://arxiv.org/abs/2010.13902) ([PDF](https://arxiv.org/pdf/2010.13902)) — Systematic graph contrastive-learning design and evaluation.
- **Anchor** — [Large-Scale Representation Learning on Graphs via Bootstrapping](https://arxiv.org/abs/2102.06514) ([PDF](https://arxiv.org/pdf/2102.06514)) — Scalable negative-free self-supervised graph learning.
- **Anchor** — [GraphMAE: Self-Supervised Masked Graph Autoencoders](https://arxiv.org/abs/2205.10803) ([PDF](https://arxiv.org/pdf/2205.10803)) — Widely adopted masked graph pretraining method.

## Evaluation, benchmarks, and failure modes

- **Anchor** — [Pitfalls of Graph Neural Network Evaluation](https://arxiv.org/abs/1811.05868) ([PDF](https://arxiv.org/pdf/1811.05868)) — Early controlled demonstration of evaluation and tuning pitfalls.
- **Anchor** — [Benchmarking Graph Neural Networks](https://arxiv.org/abs/2003.00982) ([PDF](https://arxiv.org/pdf/2003.00982)) — Reproducible architecture benchmark with standardized protocols.
- **Anchor** — [Open Graph Benchmark: Datasets for Machine Learning on Graphs](https://arxiv.org/abs/2005.00687) ([PDF](https://arxiv.org/pdf/2005.00687)) — Large, standardized, realistic graph benchmark suite.
- **Anchor** — [Beyond Homophily in Graph Neural Networks: Current Limitations and Effective Designs](https://arxiv.org/abs/2006.11468) ([PDF](https://arxiv.org/pdf/2006.11468)) — Important diagnosis and design study for heterophilous graphs.
- **Anchor** — [A critical look at the evaluation of GNNs under heterophily: Are we really making progress?](https://arxiv.org/abs/2302.11640) ([PDF](https://arxiv.org/pdf/2302.11640)) — Reevaluation exposing dataset and protocol confounds.
- **Anchor** — [On the Bottleneck of Graph Neural Networks and its Practical Implications](https://arxiv.org/abs/2006.05205) ([PDF](https://arxiv.org/pdf/2006.05205)) — Foundational analysis of over-squashing and information bottlenecks.
- **Anchor** — [Understanding over-squashing and bottlenecks on graphs via curvature](https://arxiv.org/abs/2111.14522) ([PDF](https://arxiv.org/pdf/2111.14522)) — Connects graph curvature, rewiring, and long-range failure.
- **Anchor** — [Long Range Graph Benchmark](https://arxiv.org/abs/2206.08164) ([PDF](https://arxiv.org/pdf/2206.08164)) — Benchmark designed specifically for long-range graph dependencies.

## Transformers, dynamic graphs, and long-range models

- **Anchor** — [Heterogeneous Graph Transformer](https://arxiv.org/abs/2003.01332) ([PDF](https://arxiv.org/pdf/2003.01332)) — Canonical transformer architecture for typed heterogeneous graphs.
- **Anchor** — [Temporal Graph Networks for Deep Learning on Dynamic Graphs](https://arxiv.org/abs/2006.10637) ([PDF](https://arxiv.org/pdf/2006.10637)) — General memory-based framework for continuous-time dynamic graphs.
- **Anchor** — [Do Transformers Really Perform Bad for Graph Representation?](https://arxiv.org/abs/2106.05234) ([PDF](https://arxiv.org/pdf/2106.05234)) — Introduced Graphormer and structural encodings for graph transformers.
- **Anchor** — [Recipe for a General, Powerful, Scalable Graph Transformer](https://arxiv.org/abs/2205.12454) ([PDF](https://arxiv.org/pdf/2205.12454)) — Modular GraphGPS recipe validated across diverse benchmarks.
- **Anchor** — [Exphormer: Sparse Transformers for Graphs](https://arxiv.org/abs/2303.06147) ([PDF](https://arxiv.org/pdf/2303.06147)) — Sparse global attention with theoretical and empirical support.
- **Anchor** — [Graph Mamba: Towards Learning on Graphs with State Space Models](https://arxiv.org/abs/2402.08678) ([PDF](https://arxiv.org/pdf/2402.08678)) — Careful adaptation of selective state-space models to graphs.

## Knowledge graphs and relational reasoning

- **Anchor** — [A Semantic Matching Energy Function for Learning with Multi-relational Data](https://arxiv.org/abs/1301.3485) ([PDF](https://arxiv.org/pdf/1301.3485)) — Strong pre-TransE energy-based baseline for multi-relational representation learning.
- **Anchor** — [Embedding Entities and Relations for Learning and Inference in Knowledge Bases](https://arxiv.org/abs/1412.6575) ([PDF](https://arxiv.org/pdf/1412.6575)) — Introduced the influential DistMult bilinear model.
- **Anchor** — [Complex Embeddings for Simple Link Prediction](https://arxiv.org/abs/1606.06357) ([PDF](https://arxiv.org/pdf/1606.06357)) — ComplEx handles asymmetric relations with complex embeddings.
- **Anchor** — [Modeling Relational Data with Graph Convolutional Networks](https://arxiv.org/abs/1703.06103) ([PDF](https://arxiv.org/pdf/1703.06103)) — Introduced relational GCNs for multi-relational graphs.
- **Anchor** — [TuckER: Tensor Factorization for Knowledge Graph Completion](https://arxiv.org/abs/1901.09590) ([PDF](https://arxiv.org/pdf/1901.09590)) — Strong tensor-factorization baseline with expressivity analysis.
- **Anchor** — [RotatE: Knowledge Graph Embedding by Relational Rotation in Complex Space](https://arxiv.org/abs/1902.10197) ([PDF](https://arxiv.org/pdf/1902.10197)) — Models symmetry, inversion, and composition as rotations.
- **Anchor** — [A Re-evaluation of Knowledge Graph Completion Methods](https://arxiv.org/abs/1911.03903) ([PDF](https://arxiv.org/pdf/1911.03903)) — Controlled comparison exposing evaluation and tuning effects.
- **Anchor** — [Inductive Relation Prediction by Subgraph Reasoning](https://arxiv.org/abs/1911.06962) ([PDF](https://arxiv.org/pdf/1911.06962)) — Introduced GraIL for inductive relational reasoning.
- **Anchor** — [Knowledge Graphs](https://arxiv.org/abs/2003.02320) ([PDF](https://arxiv.org/pdf/2003.02320)) — Comprehensive peer-reviewed knowledge-graph survey.
- **Anchor** — [Neural Bellman-Ford Networks: A General Graph Neural Network Framework for Link Prediction](https://arxiv.org/abs/2106.06935) ([PDF](https://arxiv.org/pdf/2106.06935)) — Unifies path reasoning with generalized Bellman-Ford computation.
- **Anchor** — [A*Net: A Scalable Path-based Reasoning Approach for Knowledge Graphs](https://arxiv.org/abs/2206.04798) ([PDF](https://arxiv.org/pdf/2206.04798)) — Scalable learned path selection inspired by A* search.
- **Anchor** — [Towards Foundation Models for Knowledge Graph Reasoning](https://arxiv.org/abs/2310.04562) ([PDF](https://arxiv.org/pdf/2310.04562)) — ULTRA demonstrates transferable zero-shot reasoning across unseen KGs.

## Graph generation

- **Anchor** — [GraphVAE: Towards Generation of Small Graphs Using Variational Autoencoders](https://arxiv.org/abs/1802.03480) ([PDF](https://arxiv.org/pdf/1802.03480)) — Early variational generative model for graph structure.
- **Anchor** — [Junction Tree Variational Autoencoder for Molecular Graph Generation](https://arxiv.org/abs/1802.04364) ([PDF](https://arxiv.org/pdf/1802.04364)) — Seminal valid molecular generation through junction trees.
- **Anchor** — [GraphRNN: Generating Realistic Graphs with Deep Auto-regressive Models](https://arxiv.org/abs/1802.08773) ([PDF](https://arxiv.org/pdf/1802.08773)) — Influential autoregressive model and graph-generation evaluation.
- **Anchor** — [Score-based Generative Modeling of Graphs via the System of Stochastic Differential Equations](https://arxiv.org/abs/2202.02514) ([PDF](https://arxiv.org/pdf/2202.02514)) — Principled score-based diffusion for discrete graph generation.
- **Anchor** — [DiGress: Discrete Denoising diffusion for graph generation](https://arxiv.org/abs/2209.14734) ([PDF](https://arxiv.org/pdf/2209.14734)) — Strong discrete diffusion formulation with broad evaluation.

## Neural algorithmic reasoning

- **Anchor** — [Learning Combinatorial Optimization Algorithms over Graphs](https://arxiv.org/abs/1704.01665) ([PDF](https://arxiv.org/pdf/1704.01665)) — Seminal learned graph optimization with reinforcement learning.
- **Anchor** — [Attention, Learn to Solve Routing Problems!](https://arxiv.org/abs/1803.08475) ([PDF](https://arxiv.org/pdf/1803.08475)) — Influential attention model for routing and combinatorial optimization.
- **Anchor** — [DAGs with NO TEARS: Continuous Optimization for Structure Learning](https://arxiv.org/abs/1803.01422) ([PDF](https://arxiv.org/pdf/1803.01422)) — Foundational continuous method for learning directed acyclic graphs.
- **Anchor** — [Neural Algorithmic Reasoning](https://arxiv.org/abs/2105.02761) ([PDF](https://arxiv.org/pdf/2105.02761)) — Defines the modern neural algorithmic reasoning research program.
- **Anchor** — [The CLRS Algorithmic Reasoning Benchmark](https://arxiv.org/abs/2205.15659) ([PDF](https://arxiv.org/pdf/2205.15659)) — Standardized benchmark spanning classical graph and non-graph algorithms.
- **Anchor** — [A Generalist Neural Algorithmic Learner](https://arxiv.org/abs/2209.11142) ([PDF](https://arxiv.org/pdf/2209.11142)) — Multi-task algorithm execution with extensive ablations.

## LLMs, GraphRAG, and graph foundation models: 2023–2025

- **Anchor** — [Can Language Models Solve Graph Problems in Natural Language?](https://arxiv.org/abs/2305.10037) ([PDF](https://arxiv.org/pdf/2305.10037)) — Early systematic evaluation of language models on graph problems.
- **Anchor** — [GPT4Graph: Can Large Language Models Understand Graph Structured Data? An Empirical Evaluation and Benchmarking](https://arxiv.org/abs/2305.15066) ([PDF](https://arxiv.org/pdf/2305.15066)) — Broad empirical benchmark of LLM graph understanding.
- **Anchor** — [Graph Meets LLMs: Towards Large Graph Models](https://arxiv.org/abs/2308.14522) ([PDF](https://arxiv.org/pdf/2308.14522)) — Early synthesis of graph foundation-model requirements.
- **Anchor** — [One for All: Towards Training One Graph Model for All Classification Tasks](https://arxiv.org/abs/2310.00149) ([PDF](https://arxiv.org/pdf/2310.00149)) — Unifies tasks and domains through text-attributed graph prompting.
- **Anchor** — [Talk like a Graph: Encoding Graphs for Large Language Models](https://arxiv.org/abs/2310.04560) ([PDF](https://arxiv.org/pdf/2310.04560)) — Controlled study of graph textualization choices and task effects.
- **Anchor** — [GraphGPT: Graph Instruction Tuning for Large Language Models](https://arxiv.org/abs/2310.13023) ([PDF](https://arxiv.org/pdf/2310.13023)) — Graph-text alignment and instruction tuning with released artifacts.
- **Anchor** — [G-Retriever: Retrieval-Augmented Generation for Textual Graph Understanding and Question Answering](https://arxiv.org/abs/2402.07630) ([PDF](https://arxiv.org/pdf/2402.07630)) — GraphQA benchmark plus optimization-grounded subgraph retrieval.
- **Anchor** — [OpenGraph: Towards Open Graph Foundation Models](https://arxiv.org/abs/2403.01121) ([PDF](https://arxiv.org/pdf/2403.01121)) — Open graph tokenizer and multi-domain zero-shot evaluation.
- **Anchor** — [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) ([PDF](https://arxiv.org/pdf/2404.16130)) — Established community-summary GraphRAG for global questions.
- **Anchor** — [HippoRAG: Neurobiologically Inspired Long-Term Memory for Large Language Models](https://arxiv.org/abs/2405.14831) ([PDF](https://arxiv.org/pdf/2405.14831)) — Graph retrieval via Personalized PageRank for associative memory.
- **Anchor** — [GraphReader: Building Graph-based Agent to Enhance Long-Context Abilities of Large Language Models](https://arxiv.org/abs/2406.14550) ([PDF](https://arxiv.org/pdf/2406.14550)) — Agentic graph traversal for long-document question answering.
- **Anchor** — [AnyGraph: Graph Foundation Model in the Wild](https://arxiv.org/abs/2408.10700) ([PDF](https://arxiv.org/pdf/2408.10700)) — Multi-domain zero-shot graph model with scaling experiments.
- **Anchor** — [LightRAG: Simple and Fast Retrieval-Augmented Generation](https://arxiv.org/abs/2410.05779) ([PDF](https://arxiv.org/pdf/2410.05779)) — Open dual-level graph and vector retrieval system.
- **Anchor** — [RAG vs. GraphRAG: A Systematic Evaluation and Key Insights](https://arxiv.org/abs/2502.11371) ([PDF](https://arxiv.org/pdf/2502.11371)) — Matched comparison identifies task-dependent GraphRAG tradeoffs.
- **Anchor** — [From RAG to Memory: Non-Parametric Continual Learning for Large Language Models](https://arxiv.org/abs/2502.14802) ([PDF](https://arxiv.org/pdf/2502.14802)) — HippoRAG 2 evaluates factual, associative, and sensemaking memory.
- **Anchor** — [PathRAG: Pruning Graph-based Retrieval Augmented Generation with Relational Paths](https://arxiv.org/abs/2502.14902) ([PDF](https://arxiv.org/pdf/2502.14902)) — Path pruning tackles redundant graph retrieval across six datasets.
- **Anchor** — [GraphRAG-Bench: Challenging Domain-Specific Reasoning for Evaluating Graph Retrieval-Augmented Generation](https://arxiv.org/abs/2506.02404) ([PDF](https://arxiv.org/pdf/2506.02404)) — Pipeline-level benchmark across disciplines, tasks, and GraphRAG methods.

## 2026 graph foundation models and transfer

- **Current-strong** — [Out-of-Distribution Generalization in Graph Foundation Models](https://arxiv.org/abs/2601.21067) ([PDF](https://arxiv.org/pdf/2601.21067)) — Direct study of cross-distribution transfer rather than in-domain accuracy.
- **Current-strong** — [Billion-Scale Graph Foundation Models](https://arxiv.org/abs/2602.04768) ([PDF](https://arxiv.org/pdf/2602.04768)) — Addresses foundation-model training at genuinely large graph scale.
- **Current-strong** — [Toward Graph-Tokenizing Large Language Models with Reconstructive Graph Instruction Tuning](https://arxiv.org/abs/2603.01385) ([PDF](https://arxiv.org/pdf/2603.01385)) — Graph tokenization validated through reconstruction and instruction tuning.
- **Current-strong** — [Evaluating Progress in Graph Foundation Models: A Comprehensive Benchmark and New Insights](https://arxiv.org/abs/2603.10033) ([PDF](https://arxiv.org/pdf/2603.10033)) — Broad benchmark designed to test whether claimed GFM progress transfers.
- **Current-strong** — [When Do Graph Foundation Models Transfer? A Data-Centric Theory](https://arxiv.org/abs/2605.29828) ([PDF](https://arxiv.org/pdf/2605.29828)) — Theory and experiments connect domain discrepancy to transfer behavior.
- **Current-strong** — [Half a Link can Be Enough to Predict a Whole Link: Understanding Generalization in Knowledge Graph Foundation Models](https://arxiv.org/abs/2606.18001) ([PDF](https://arxiv.org/pdf/2606.18001)) — Mechanistic analysis of generalization in KG foundation models.
- **Current-strong** — [A Fair Evaluation of Graph Foundation Models for Node Property Prediction](https://arxiv.org/abs/2606.24509) ([PDF](https://arxiv.org/pdf/2606.24509)) — Reevaluates nine GFMs against tuned baselines and inference cost.
- **Current-strong** — [Attacking Graph Foundation Models Through Their Shared Representation](https://arxiv.org/abs/2607.18567) ([PDF](https://arxiv.org/pdf/2607.18567)) — Identifies and tests the alignment layer as a distinct attack surface.
- **Current-strong** — [Neural Message Passing on Structural Interaction Graphs for Fully-Inductive Graph Neural Networks](https://arxiv.org/abs/2608.08567) ([PDF](https://arxiv.org/pdf/2608.08567)) — Unified treatment of feature heterogeneity and fully inductive transfer.

## 2026 graph and algorithmic reasoning

- **Current-strong** — [Learning to Execute Graph Algorithms Exactly with Graph Neural Networks](https://arxiv.org/abs/2601.23207) ([PDF](https://arxiv.org/pdf/2601.23207)) — Tests exact execution rather than approximate task accuracy.
- **Current-strong** — [Exposing Weaknesses of Large Reasoning Models through Graph Algorithm Problems](https://arxiv.org/abs/2602.06319) ([PDF](https://arxiv.org/pdf/2602.06319)) — Nine-task programmatically verified benchmark isolates context and execution failures.
- **Current-strong** — [Which Algorithms Can Graph Neural Networks Learn?](https://arxiv.org/abs/2602.13106) ([PDF](https://arxiv.org/pdf/2602.13106)) — Characterizes algorithm learnability with formal analysis.
- **Current-strong** — [MINAR: Mechanistic Interpretability for Neural Algorithmic Reasoning](https://arxiv.org/abs/2602.21442) ([PDF](https://arxiv.org/pdf/2602.21442)) — Mechanistic interpretability targeted at learned algorithm execution.
- **Current-strong** — [Evaluating LLMs on Large-Scale Graph Property Estimation via Random Walks](https://arxiv.org/abs/2605.01484) ([PDF](https://arxiv.org/pdf/2605.01484)) — Scales graph-property evaluation beyond tiny serialized graphs.
- **Current-strong** — [EGL-SCA: Structural Credit Assignment for Co-Evolving Instructions and Tools in Graph Reasoning Agents](https://arxiv.org/abs/2605.10366) ([PDF](https://arxiv.org/pdf/2605.10366)) — Verifier-centric experiments route failures between instructions and executable tools.
- **Current-strong** — [GraphARC: A Comprehensive Benchmark for Graph-Based Abstract Reasoning](https://arxiv.org/abs/2605.31031) ([PDF](https://arxiv.org/pdf/2605.31031)) — Peer-reviewed benchmark of few-shot graph transformations and scaling.
- **Current-strong** — [GraphInfer-Bench: Benchmarking LLM's Inference Capability on Graphs](https://arxiv.org/abs/2606.11562) ([PDF](https://arxiv.org/pdf/2606.11562)) — Benchmark isolates graph inference behavior across tasks and structures.
- **Current-strong** — [Formalizing and Mitigating Structural Distortion in LLM Attention for Graph Reasoning](https://arxiv.org/abs/2606.15633) ([PDF](https://arxiv.org/pdf/2606.15633)) — Formalizes a concrete failure mode in serialized-graph attention.
- **Current-strong** — [Closed-Loop Graph Algorithm Execution with Small Language Models: Step Accuracy and Rollout Reliability](https://arxiv.org/abs/2606.24980) ([PDF](https://arxiv.org/pdf/2606.24980)) — Separates next-step accuracy from complete rollout reliability with intervention diagnostics.
- **Current-strong** — [GraphVerse: A Comprehensive Visual Graph Reasoning Benchmark for Multimodal Large Language Models](https://arxiv.org/abs/2608.06769) ([PDF](https://arxiv.org/pdf/2608.06769)) — Broad multimodal benchmark with visual graph reasoning tasks.
- **Current-strong** — [Unified Multi-Dimensional Benchmark for Complex Graph Reasoning in Large Language Models](https://arxiv.org/abs/2608.12391) ([PDF](https://arxiv.org/pdf/2608.12391)) — Multi-dimensional evaluation of complex graph reasoning behavior.

## 2026 GraphRAG and structured retrieval

- **Current-strong** — [WildGraphBench: Benchmarking GraphRAG with Wild-Source Corpora](https://arxiv.org/abs/2602.02053) ([PDF](https://arxiv.org/pdf/2602.02053)) — Moves GraphRAG evaluation toward messy real-world corpora.
- **Current-strong** — [Use Graph When It Needs: Efficiently and Adaptively Integrating Retrieval-Augmented Generation with Graphs](https://arxiv.org/abs/2602.03578) ([PDF](https://arxiv.org/pdf/2602.03578)) — Routes between dense and graph retrieval using query complexity.
- **Current-strong** — [Retrieving Minimal and Sufficient Reasoning Subgraphs with Graph Foundation Models for Path-aware GraphRAG](https://arxiv.org/abs/2603.07179) ([PDF](https://arxiv.org/pdf/2603.07179)) — Explicitly optimizes retrieval sufficiency and subgraph minimality.
- **Current-strong** — [UnWeaving the knots of GraphRAG -- turns out VectorRAG is almost enough](https://arxiv.org/abs/2603.29875) ([PDF](https://arxiv.org/pdf/2603.29875)) — Useful negative comparison of GraphRAG complexity, quality, and cost.
- **Current-strong** — [LogicPoison: Logical Attacks on Graph Retrieval-Augmented Generation](https://arxiv.org/abs/2604.02954) ([PDF](https://arxiv.org/pdf/2604.02954)) — Tests graph-specific logical poisoning rather than generic prompt attacks.
- **Current-strong** — [Do We Still Need GraphRAG? Benchmarking RAG and GraphRAG for Agentic Search Systems](https://arxiv.org/abs/2604.09666) ([PDF](https://arxiv.org/pdf/2604.09666)) — Matched backbones and budgets expose accuracy, stability, and cost tradeoffs.
- **Current-strong** — [XGRAG: A Graph-Native Framework for Explaining KG-based Retrieval-Augmented Generation](https://arxiv.org/abs/2604.24623) ([PDF](https://arxiv.org/pdf/2604.24623)) — Causal graph perturbations evaluate evidence contribution and explanations.
- **Current-strong** — [Knowledge-Graph Grounding Helps LLMs Only for Out-of-Training Knowledge: A Controlled Study on Clinical Question Answering](https://arxiv.org/abs/2606.22419) ([PDF](https://arxiv.org/pdf/2606.22419)) — Controlled result identifies when KG grounding does and does not help.
- **Current-strong** — [Efficient Retrieval-Augmented Generation via Token Co-occurrence Graphs](https://arxiv.org/abs/2606.30093) ([PDF](https://arxiv.org/pdf/2606.30093)) — Avoids expensive LLM graph extraction and reports retrieval efficiency.
- **Current-strong** — [When Do Multimodal and Graph-Augmented RAG Help? A Controlled Evaluation for Document Question Answering](https://arxiv.org/abs/2607.16604) ([PDF](https://arxiv.org/pdf/2607.16604)) — Four-way ablation reports a reproducible null result for graph augmentation.

## 2026 evaluation, robustness, and diagnostics

- **Current-strong** — [Adversarial Graph Neural Network Benchmarks: Towards Practical and Fair Evaluation](https://arxiv.org/abs/2605.05534) ([PDF](https://arxiv.org/pdf/2605.05534)) — Standardizes practical adversarial evaluation across graph models.
- **Current-strong** — [Invariant-Based Diagnostics for Graph Benchmarks](https://arxiv.org/abs/2605.06462) ([PDF](https://arxiv.org/pdf/2605.06462)) — Uses invariants to detect benchmark leakage and task shortcuts.
- **Current-strong** — [On the Safety of Graph Representation Learning](https://arxiv.org/abs/2605.06576) ([PDF](https://arxiv.org/pdf/2605.06576)) — Systematic treatment of graph-model safety surfaces and controls.
- **Current-strong** — [GAD in the Wild: Benchmarking Graph Anomaly Detection under Realistic Deployment Challenges](https://arxiv.org/abs/2605.07133) ([PDF](https://arxiv.org/pdf/2605.07133)) — Million-scale, extreme-imbalance, and missing-feature diagnostics with released benchmarks.
- **Current-strong** — [The Post-GCN Decade Revisited: Curvature-Stratified Evaluation of Relational Learning](https://arxiv.org/abs/2606.06397) ([PDF](https://arxiv.org/pdf/2606.06397)) — Stratified evaluation revisits progress after controlling graph geometry.
- **Current-strong** — [LLM Features Can Hurt GNNs: Concatenation Interference on Homophilous Graph Benchmarks](https://arxiv.org/abs/2606.17579) ([PDF](https://arxiv.org/pdf/2606.17579)) — Negative result isolates harmful graph-text feature fusion.
- **Current-strong** — [Measuring What Matters: A Unified Evaluation Framework for GNN Explainability](https://arxiv.org/abs/2607.04600) ([PDF](https://arxiv.org/pdf/2607.04600)) — Unifies explainability metrics and tests whether explanations are useful.
- **Current-strong** — [OpenRTAG: A Comprehensive Benchmark for Robust Text-Attributed Graph Learning under Data Quality Degradation](https://arxiv.org/abs/2607.19108) ([PDF](https://arxiv.org/pdf/2607.19108)) — Evaluates robustness under realistic text and topology degradation.
