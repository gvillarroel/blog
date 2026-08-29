import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const postPath = new URL(
  '../src/content/posts/from-benchmarks-to-skill-evolution.md',
  import.meta.url,
);
const post = readFileSync(postPath, 'utf8');
const diagramRuntime = readFileSync(
  new URL('../src/components/DiagramRuntime.astro', import.meta.url),
  'utf8',
);
const globalCss = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const frontmatterEnd = post.indexOf('\n---', 4);
const frontmatter = post.slice(0, frontmatterEnd);
const body = post.slice(frontmatterEnd + 4);
const referenceUrls = new Set(
  [...frontmatter.matchAll(/^\s+url: "([^"]+)"/gm)].map((match) => match[1]),
);
const bodyUrls = new Set(
  [...body.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]),
);
const mermaidDiagrams = [...post.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)].map(
  (match) => match[1],
);

test('skill-evaluation post preserves the historical and promotion diagrams', () => {
  assert.equal(mermaidDiagrams.length, 2);
  assert.match(mermaidDiagrams[0], /static benchmarks/);
  assert.match(mermaidDiagrams[0], /Evaluation-guided evolution/);
  assert.match(mermaidDiagrams[0], /Persistent learning/);
  assert.match(mermaidDiagrams[1], /Holdout passes/);
  assert.match(mermaidDiagrams[1], /Promote independently/);

  for (const diagram of mermaidDiagrams) {
    assert.match(diagram, /"background": "#ffffff"/);
    assert.match(diagram, /"primaryTextColor": "#111827"/);
    assert.doesNotMatch(diagram, /#0c111b|#172033|#111927|#f3f6fb/i);
  }
});

test('published post includes the light, high-contrast D3 and editorial visual package', () => {
  const assetRoot = new URL('../src/assets/images/modern-skill-evaluation/', import.meta.url);
  for (const name of [
    'skill-evaluation-hero.png',
    'definition-rails.svg',
    'wikiskill-loop.static.svg',
    'evaluation-system.static.svg',
    'capability-landscape.svg',
    'selection-guide.static.svg',
  ]) {
    assert.ok(existsSync(new URL(name, assetRoot)), `Missing published visual: ${name}`);
    assert.ok(post.includes(name), `Published post does not reference: ${name}`);
  }

  const rails = readFileSync(new URL('definition-rails.svg', assetRoot), 'utf8');
  const capability = readFileSync(new URL('capability-landscape.svg', assetRoot), 'utf8');
  assert.match(rails, /Four artifacts, four causal questions/);
  assert.match(rails, /fill="#ffffff"/);
  assert.match(capability, /Capability landscape/);
  assert.match(capability, /fill="#ffffff"/);
});

test('wide Mermaid diagrams retain a readable mobile scale with an explicit scroll hint', () => {
  assert.match(diagramRuntime, /viewBox\.width \/ viewBox\.height < 2\.4/);
  assert.match(diagramRuntime, /classList\.add\('diagram--wide'\)/);
  assert.match(diagramRuntime, /Scroll horizontally to inspect the full diagram/);
  assert.match(
    globalCss,
    /\[data-diagram='mermaid'\]\.diagram--wide \.mermaid > svg[\s\S]*?width: 72rem/,
  );
  assert.match(globalCss, /img\[alt\^='Definition rails'\][\s\S]*?width: 70rem/);
  assert.match(
    globalCss,
    /img\[alt\^='Capability landscape for modern skill-evaluation'\][\s\S]*?width: 80rem/,
  );
  assert.match(globalCss, /Scroll horizontally to inspect the full figure/);
});

test('capability matrix covers execution, testing, RAG, typed, and observability tools', () => {
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
    assert.match(post, new RegExp(`\\| \\[?${framework.replace(' AI', '(?: AI)?')}`));
  }
  assert.match(post, /Skill as treatment/);
  assert.match(post, /Isolated, stateful world/);
  assert.match(post, /Built-in evolution/);
});

test('study contract freezes identity, splits, failure policy, and promotion authority', () => {
  for (const required of [
    'baseline_digest',
    'task-and-environment-digests',
    'validation: one-way-release',
    'holdout: sealed-until-finalist',
    'semantic_failure: 0',
    'verified_external_failure: bounded-and-lineage-preserving',
    'authority: independent-reviewer',
  ]) {
    assert.ok(post.includes(required), `Missing study control: ${required}`);
  }
});

test('WikiSkill is integrated without overstating open-source readiness', () => {
  for (const required of [
    'Raw Layer',
    'Wiki Layer',
    'Skills Layer',
    '48.7% to',
    '63.7%',
    'does not evaluate skill',
    'retrieval or triggering',
    'no automated pruning mechanism',
    'does not link a public',
  ]) {
    assert.ok(post.includes(required), `Missing WikiSkill qualification: ${required}`);
  }
  assert.match(post, /optimizer proposes or selects treatments; it does not prove that they generalize/i);
});

test('local case-study claims remain bounded and retain failed promotions', () => {
  assert.match(post, /24 Harbor jobs and 78 trials/);
  assert.match(post, /not identifiable/);
  assert.match(post, /98\.674426%/);
  assert.match(post, /zero-regression rule retained the baseline/);
  assert.match(post, /source-visible, not\s+open-source dependencies/);
});

test('every inline source is declared and no private corpus location is published', () => {
  for (const url of bodyUrls) {
    assert.ok(referenceUrls.has(url), `Inline source is missing from references: ${url}`);
  }
  assert.doesNotMatch(post, /knowledge\/expert-sources|knowledge\/private-sources|\.know\//i);
  assert.doesNotMatch(post, /C:\\Users\\|C:\/Users\//i);
});
