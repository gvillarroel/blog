import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  assert.match(mermaidDiagrams[0], /Experiment tracking/);
  assert.match(mermaidDiagrams[0], /Trace-guided evolution/);
  assert.match(mermaidDiagrams[1], /Sealed holdout/);
  assert.match(mermaidDiagrams[1], /Independent promotion/);
});

test('wide Mermaid diagrams retain a readable mobile scale with an explicit scroll hint', () => {
  assert.match(diagramRuntime, /viewBox\.width \/ viewBox\.height < 2\.4/);
  assert.match(diagramRuntime, /classList\.add\('diagram--wide'\)/);
  assert.match(diagramRuntime, /Scroll horizontally to inspect the full diagram/);
  assert.match(
    globalCss,
    /\[data-diagram='mermaid'\]\.diagram--wide \.mermaid > svg[\s\S]*?width: 72rem/,
  );
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
