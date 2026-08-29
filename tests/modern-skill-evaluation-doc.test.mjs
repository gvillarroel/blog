import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const docUrl = new URL('../docs/modern-skill-evaluation.md', import.meta.url);
const doc = readFileSync(docUrl, 'utf8');
const assetRoot = new URL('../docs/assets/modern-skill-evaluation/', import.meta.url);

const figureTargets = [...doc.matchAll(/^!\[[^\]]+\]\(([^)]+)\)$/gm)].map(
  (match) => match[1],
);
const animatedTargets = [...doc.matchAll(/\[Animated SVG\]\(([^)]+)\)/g)].map(
  (match) => match[1],
);
const mermaidTargets = [...doc.matchAll(/\[Mermaid source\]\(([^)]+)\)/g)].map(
  (match) => match[1],
);

test('final guide includes the complete authored and generated visual package', () => {
  assert.equal(figureTargets.length, 8);
  assert.equal(animatedTargets.length, 5);
  assert.equal(mermaidTargets.length, 5);
  assert.match(doc, /\[D3 authoring source\]\(assets\/modern-skill-evaluation\/capability-landscape\.html\)/);
  assert.match(doc, /\[D3 authoring source\]\(assets\/modern-skill-evaluation\/definition-rails\.html\)/);

  const targets = [
    ...figureTargets,
    ...animatedTargets,
    ...mermaidTargets,
    'assets/modern-skill-evaluation/capability-landscape.html',
    'assets/modern-skill-evaluation/capability-landscape.png',
    'assets/modern-skill-evaluation/definition-rails.html',
    'assets/modern-skill-evaluation/definition-rails.png',
  ];

  for (const target of targets) {
    assert.ok(
      existsSync(fileURLToPath(new URL(`../docs/${target}`, import.meta.url))),
      `Missing visual asset: ${target}`,
    );
  }
});

test('generated SVGs retain dimensions, content, and accessible descriptions', () => {
  for (const target of [
    ...figureTargets.filter((target) => target.endsWith('.svg')),
    ...animatedTargets,
  ]) {
    const svg = readFileSync(new URL(target.split('/').at(-1), assetRoot), 'utf8');
    assert.match(svg, /<svg\b/);
    assert.match(svg, /viewBox="[^"]+"/);
    assert.match(svg, /<(?:title|desc|text|foreignObject)\b/);
    assert.ok(svg.length > 5_000, `${target} is unexpectedly small`);
  }

  const d3Svg = readFileSync(new URL('capability-landscape.svg', assetRoot), 'utf8');
  assert.match(d3Svg, /Skill identity/);
  assert.match(d3Svg, /Built-in search/);
  assert.match(d3Svg, /not a benchmark/i);

  const railsSvg = readFileSync(new URL('definition-rails.svg', assetRoot), 'utf8');
  assert.match(railsSvg, /Four artifacts, four causal questions/);
  assert.match(railsSvg, /EVALUATION HARNESS/);
  assert.match(railsSvg, /Was the comparison measured reliably/);
});

test('visuals use embedded light backgrounds and high-contrast authored palettes', () => {
  for (const target of [...mermaidTargets]) {
    const source = readFileSync(new URL(target.split('/').at(-1), assetRoot), 'utf8');
    assert.match(source, /"background": "#ffffff"/);
    assert.match(source, /"primaryTextColor": "#111827"/);
    assert.doesNotMatch(source, /#0c111b|#172033|#111927|#f3f6fb/i);
  }

  for (const name of [
    'capability-landscape.html',
    'definition-rails.html',
  ]) {
    const source = readFileSync(new URL(name, assetRoot), 'utf8');
    assert.match(source, /background: #ffffff/);
  }

  for (const name of [
    'evaluation-evolution.static.svg',
    'evaluation-system.static.svg',
    'promotion-loop.static.svg',
    'selection-guide.static.svg',
    'wikiskill-loop.static.svg',
  ]) {
    const source = readFileSync(new URL(name, assetRoot), 'utf8');
    assert.match(source, /data-diagram-background="light"/);
  }
});

test('comparison covers the intended open and proprietary framework set', () => {
  for (const framework of [
    'Harbor',
    'Inspect AI',
    'Promptfoo',
    'OpenAI Evals',
    'DeepEval',
    'Ragas',
    'Pydantic Evals',
    'MLflow',
    'Langfuse',
    'Phoenix',
    'LangSmith',
  ]) {
    assert.ok(doc.includes(framework), `Missing framework: ${framework}`);
  }

  assert.match(doc, /Public on GitHub[^\n]+not a license/);
  assert.match(doc, /source available, but not OSI open source/i);
  assert.match(doc, /LangSmith \| Proprietary/);
});

test('modern evaluation pillars and auditable promotion controls remain complete', () => {
  const pillars = [...doc.matchAll(/^\d+\. \*\*[^*]+\.\*\*/gm)];
  assert.equal(pillars.length, 10);

  for (const required of [
    'baseline_digest',
    'task-and-environment-digests',
    'validation: one-way-release',
    'holdout: sealed-until-finalist',
    'semantic_failure: 0',
    'verified_external_failure: bounded-and-lineage-preserving',
    'persistent_knowledge: separately-versioned',
    'rejected_proposals: retained',
    'authority: independent-reviewer',
  ]) {
    assert.ok(doc.includes(required), `Missing study control: ${required}`);
  }
});

test('WikiSkill is integrated as a persistent-learning method without overstating adoptability', () => {
  for (const required of [
    'Raw Layer',
    'Wiki Layer',
    'Skills Layer',
    '48.7% to',
    '63.7%',
    'does not evaluate',
    'skill retrieval or triggering',
    'no automated pruning mechanism',
    'does not link a public',
  ]) {
    assert.ok(doc.includes(required), `Missing WikiSkill qualification: ${required}`);
  }
  assert.match(doc, /optimizer proposes or selects treatments; it does not prove\s+that they generalize/i);
});

test('local case-study evidence stays bounded and private corpora stay private', () => {
  assert.match(doc, /24 Harbor jobs and 78 trials/);
  assert.match(doc, /98\.674426%/);
  assert.match(doc, /zero-regression rule retained the baseline/);
  assert.match(doc, /evidence for those tasks and budgets,\s+not a\s+universal ranking/i);

  assert.doesNotMatch(doc, /knowledge\/expert-sources|knowledge\/private-sources|\.know\//i);
  assert.doesNotMatch(doc, /C:\\Users\\|C:\/Users\//i);
});
