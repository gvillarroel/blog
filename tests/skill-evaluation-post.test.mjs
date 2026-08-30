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

test('skill-evaluation post preserves the Mermaid promotion diagram and publishes the D3 history', () => {
  assert.equal(mermaidDiagrams.length, 1);
  assert.match(mermaidDiagrams[0], /Holdout passes/);
  assert.match(mermaidDiagrams[0], /Promote independently/);
  assert.match(post, /evaluation-evolution\.static\.svg/);
  assert.match(post, /Each generation adds a new observable or experimental control/);

  for (const diagram of mermaidDiagrams) {
    assert.match(diagram, /"background": "#ffffff"/);
    assert.match(diagram, /"primaryTextColor": "#111827"/);
    assert.doesNotMatch(diagram, /#0c111b|#172033|#111927|#f3f6fb/i);
  }
});

test('published post includes the light, high-contrast RoadRails, D3, and editorial visual package', () => {
  const assetRoot = new URL('../src/assets/images/modern-skill-evaluation/', import.meta.url);
  for (const name of [
    'skill-evaluation-hero.png',
    'treatment-boundary-editorial-v2.png',
    'definition-railroads.static.svg',
    'evaluation-evolution.static.svg',
    'wikiskill-loop.static.svg',
    'evaluation-system-editorial-v2.png',
    'capability-landscape.svg',
    'selection-guide.static.svg',
  ]) {
    assert.ok(existsSync(new URL(name, assetRoot)), `Missing published visual: ${name}`);
    assert.ok(post.includes(name), `Published post does not reference: ${name}`);
  }

  const rails = readFileSync(new URL('definition-railroads.static.svg', assetRoot), 'utf8');
  const capability = readFileSync(new URL('capability-landscape.svg', assetRoot), 'utf8');
  assert.match(rails, /class="railroad-diagram"/);
  assert.match(rails, /agent_harness =/);
  assert.match(rails, /evaluation =/);
  assert.match(rails, /background-color: white/);
  assert.doesNotMatch(rails, /model weights|fixed model API/i);
  assert.match(capability, /Capability landscape/);
  assert.match(capability, /Paired skill lift/);
  assert.match(capability, /NVIDIA SkillEvaluator/);
  assert.match(capability, /fill="#ffffff"/);
});

test('published post exposes the verified PDF edition', () => {
  assert.match(
    post,
    /https:\/\/github\.com\/gvillarroel\/blog\/releases\/download\/skill-evaluation-guide-2026-08-30\/modern-skill-evaluation-framework-selection-guide\.pdf/,
  );
});

test('wide Mermaid diagrams retain a readable mobile scale with an explicit scroll hint', () => {
  assert.match(diagramRuntime, /viewBox\.width \/ viewBox\.height < 2\.4/);
  assert.match(diagramRuntime, /classList\.add\('diagram--wide'\)/);
  assert.match(diagramRuntime, /Scroll horizontally to inspect the full diagram/);
  assert.match(
    globalCss,
    /\[data-diagram='mermaid'\]\.diagram--wide \.mermaid > svg[\s\S]*?width: 72rem/,
  );
  assert.match(globalCss, /img\[alt\^='RoadRails definitions'\][\s\S]*?width: 66rem/);
  assert.match(
    globalCss,
    /img\[alt\^='Editorial treatment boundary'\][\s\S]*?width: 66rem/,
  );
  assert.match(
    globalCss,
    /img\[alt\^='Editorial architecture of a controlled skill evaluation'\][\s\S]*?width: 70rem/,
  );
  assert.match(
    globalCss,
    /img\[alt\^='Capability landscape for modern skill-evaluation'\][\s\S]*?width: 80rem/,
  );
  assert.match(globalCss, /Scroll horizontally to inspect the full figure/);
});

test('capability matrix covers execution, testing, RAG, typed, and observability tools', () => {
  for (const framework of [
    'Harbor',
    'NVIDIA SkillEvaluator',
    'AWS sample skill-eval',
    'SkillTester',
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
    'Microsoft SkillOpt',
    'SkillOps',
  ]) {
    assert.match(post, new RegExp(`\\| \\[?${framework.replace(' AI', '(?: AI)?')}`));
  }
  assert.match(post, /Dedicated skill evaluators/);
  assert.match(post, /no-skill\/with-skill Skill Lift/);
  assert.match(post, /Task runners and evaluation libraries/);
  assert.match(post, /Evolution and library operations are not evaluation frameworks/);
});

test('study controls remain explicit without the removed YAML contract chapter', () => {
  for (const required of [
    'complete directory',
    'Disjoint data roles',
    'Holdout release is one-way',
    'Do not retry semantic failures until they pass',
    'immutable skill provenance',
    'independent promotion',
    'no-skill/with-skill contrast',
  ]) {
    assert.ok(post.includes(required), `Missing study control: ${required}`);
  }
  assert.doesNotMatch(post, /A minimal, auditable study contract|```yaml/);
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
  assert.match(post, /Both supporting repositories and the reports cited above are public/);
  assert.match(post, /No private\s+knowledge-corpus text/);
});

test('every inline source is declared and no private corpus location is published', () => {
  for (const url of bodyUrls) {
    assert.ok(referenceUrls.has(url), `Inline source is missing from references: ${url}`);
  }
  assert.doesNotMatch(post, /knowledge\/expert-sources|knowledge\/private-sources|\.know\//i);
  assert.doesNotMatch(post, /C:\\Users\\|C:\/Users\//i);
});

test('substantive article paragraphs carry paired public-source links', () => {
  const proseBody = body.replace(/```[\s\S]*?```/g, '');
  const blocks = proseBody.split(/\r?\n\s*\r?\n/);
  const uncited = [];

  for (const block of blocks) {
    const text = block.replace(/\r?\n/g, ' ').trim();
    if (
      text.length < 50 ||
      /^(?:#{1,6}\s|!\[|\||```|---|\s*(?:[-*+] |\d+\. )|\*\*PDF edition:)/.test(text) ||
      /^\[[^\]]+\]\([^)]+\)(?:\s*\|\s*\[[^\]]+\]\([^)]+\))*$/.test(text)
    ) {
      continue;
    }

    const sourceCount = (text.match(/https:\/\//g) ?? []).length;
    if (sourceCount < 2) uncited.push(text.slice(0, 140));
  }

  assert.deepEqual(uncited, []);
});
