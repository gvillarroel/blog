import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const postPath = new URL(
  '../src/content/posts/ai-architecture-old-ideas-new-probability.md',
  import.meta.url,
);
const runtimePath = new URL('../src/components/DiagramRuntime.astro', import.meta.url);
const post = readFileSync(postPath, 'utf8');
const runtime = readFileSync(runtimePath, 'utf8');
const specs = [...post.matchAll(/```d3\r?\n([\s\S]*?)```/g)].map((match) =>
  JSON.parse(match[1]),
);
const mermaidDiagrams = [...post.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)].map(
  (match) => match[1],
);
const frontmatter = post.slice(0, post.indexOf('\n---', 4));
const referenceUrls = new Set(
  [...frontmatter.matchAll(/^\s+url: "([^"]+)"/gm)].map((match) => match[1]),
);

test('AI architecture post declares one annual heatmap', () => {
  assert.equal(specs.length, 1);
  assert.equal(specs[0].type, 'annual-milestone-heatmap');
  assert.doesNotMatch(post, /concept-lineage|concept-heatmap/);
});

test('annual inventory has the audited scope, exact tracks, and stable counts', () => {
  const heatmap = specs[0];
  assert.equal(heatmap.yearStart, 1943);
  assert.equal(heatmap.yearEnd, 2026);
  assert.equal(heatmap.booksAudited, 56);
  assert.deepEqual(heatmap.domains, ['Architecture', 'LLM systems']);
  assert.equal(heatmap.data.length, 60);

  const counts = Object.fromEntries(
    heatmap.domains.map((domain) => [
      domain,
      heatmap.data.filter((milestone) => milestone.domain === domain).length,
    ]),
  );
  assert.deepEqual(counts, { Architecture: 29, 'LLM systems': 31 });
  assert.equal(
    heatmap.data.filter((milestone) => milestone.year === 2020 && milestone.domain === 'LLM systems').length,
    3,
  );
  assert.equal(
    heatmap.data.filter((milestone) => milestone.year === 2022 && milestone.domain === 'LLM systems').length,
    4,
  );
  assert.equal(heatmap.data.filter((milestone) => milestone.year === 2026).length, 0);
});

test('every counted milestone is unique, categorized, linked, and represented in references', () => {
  const heatmap = specs[0];
  const validKinds = new Set(['paper', 'book', 'concept', 'pattern', 'practice', 'protocol']);
  const identities = new Set();

  for (const milestone of heatmap.data) {
    assert.ok(heatmap.domains.includes(milestone.domain), `${milestone.title} has an unknown track`);
    assert.ok(
      milestone.year >= heatmap.yearStart && milestone.year <= heatmap.yearEnd,
      `${milestone.title} falls outside the audit window`,
    );
    assert.ok(validKinds.has(milestone.kind), `${milestone.title} has an unknown evidence type`);
    assert.ok(milestone.category.length > 0, `${milestone.title} has no theme`);
    assert.match(milestone.url, /^https:\/\//);
    assert.ok(referenceUrls.has(milestone.url), `${milestone.title} is missing from frontmatter references`);

    const identity = `${milestone.year}|${milestone.domain}|${milestone.title}`;
    assert.ok(!identities.has(identity), `${milestone.title} is counted more than once`);
    identities.add(identity);
  }
});

test('both fishbone diagrams use Mermaid and converge on the qualified proposal', () => {
  assert.equal(mermaidDiagrams.length, 3);
  const fishbones = mermaidDiagrams.slice(0, 2);
  for (const fishbone of fishbones) {
    assert.match(fishbone, /flowchart LR/);
    assert.match(fishbone, /Graph engineering/);
    assert.match(fishbone, /classDef target/);
  }
  assert.match(fishbones[0], /Information hiding/);
  assert.match(fishbones[0], /Circuit breaker/);
  assert.match(fishbones[1], /Transformer/);
  assert.match(fishbones[1], /GraphRAG/);
  assert.match(post, /not presented as an established job title/i);
});

test('runtime preserves interactive inspection and a print-visible full inventory', () => {
  assert.match(runtime, /renderAnnualHeatmap/);
  assert.match(runtime, /annual-heatmap__inventory/);
  assert.match(runtime, /inventory\.open = true/);
  assert.match(runtime, /first-dated milestones/);
});

test('public post does not expose private knowledge paths', () => {
  assert.doesNotMatch(post, /knowledge\/expert-sources|\.know\//i);
});
