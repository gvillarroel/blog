import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const agentSpecs = [
  {
    source: 'knowledge/public/agent-systems/harnesses.md',
    index: 'knowledge/public/agent-systems/harnesses-index.md',
    count: 79,
    firstId: '2605.27922',
  },
  {
    source: 'knowledge/public/agent-systems/skills.md',
    index: 'knowledge/public/agent-systems/skills-index.md',
    count: 32,
    firstId: '2602.12670',
  },
  {
    source: 'knowledge/public/agent-systems/context.md',
    index: 'knowledge/public/agent-systems/context-index.md',
    count: 31,
    firstId: '2602.16069',
  },
];

const rowPattern =
  /^\| (\d+) \| ([^|]+) \| (20\d{2}) \| \[(.+?)\]\(https:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})\) \| \[PDF\]\(https:\/\/arxiv\.org\/pdf\/\5\) \| (.+?) \| (.+) \|$/gm;

function read(relativePath) {
  return readFileSync(resolve(repositoryRoot, relativePath), 'utf8');
}

function linkedIds(markdown, kind) {
  const pattern = new RegExp(
    `https://arxiv\\.org/${kind}/(\\d{4}\\.\\d{4,5})`,
    'g',
  );
  return [...markdown.matchAll(pattern)].map((match) => match[1]);
}

function parseRows(markdown) {
  return [...markdown.matchAll(rowPattern)].map((match) => ({
    rank: Number.parseInt(match[1], 10),
    priority: match[2].trim(),
    year: Number.parseInt(match[3], 10),
    title: match[4],
    id: match[5],
    topic: match[6],
    reason: match[7],
  }));
}

function assertUtilityOrdering(rows, priorityOrder) {
  assert.deepEqual(
    rows.map(({ rank }) => rank),
    Array.from({ length: rows.length }, (_, index) => index + 1),
  );

  const numericPriorities = rows.map(({ priority }) => {
    assert.ok(priorityOrder.has(priority), `Unknown priority: ${priority}`);
    return priorityOrder.get(priority);
  });
  assert.deepEqual(numericPriorities, numericPriorities.toSorted((a, b) => a - b));
}

test('agent-system priority indexes cover every paper once in utility order', () => {
  const priorityOrder = new Map([
    ['Start here', 0],
    ['Essential', 1],
    ['Useful', 2],
    ['Reference', 3],
  ]);

  for (const spec of agentSpecs) {
    const source = read(spec.source);
    const index = read(spec.index);
    const rows = parseRows(index);
    const sourceIds = linkedIds(source, 'abs').toSorted();
    const indexAbstractIds = linkedIds(index, 'abs').toSorted();
    const indexPdfIds = linkedIds(index, 'pdf').toSorted();

    assert.equal(rows.length, spec.count, `${spec.index} row count`);
    assert.equal(new Set(rows.map(({ id }) => id)).size, spec.count);
    assert.equal(rows[0].id, spec.firstId);
    assert.deepEqual(indexAbstractIds, sourceIds);
    assert.deepEqual(indexPdfIds, sourceIds);
    assertUtilityOrdering(rows, priorityOrder);
  }
});

test('Graphs and AI priority index covers the executable catalog in utility order', () => {
  const catalog = JSON.parse(
    read('knowledge/public/graphs-and-ai/catalog.json'),
  );
  const index = read('knowledge/public/graphs-and-ai/index.md');
  const rows = parseRows(index);
  const catalogIds = catalog.papers.map(({ id }) => id).toSorted();
  const priorityOrder = new Map([
    ['Start here', 0],
    ['Current strong', 1],
    ['Foundation', 2],
  ]);

  assert.equal(rows.length, catalog.selection.papers);
  assert.equal(rows[0].id, '2104.13478');
  assert.equal(rows[3].id, '2308.04512');
  assert.deepEqual(linkedIds(index, 'abs').toSorted(), catalogIds);
  assert.deepEqual(linkedIds(index, 'pdf').toSorted(), catalogIds);
  assertUtilityOrdering(rows, priorityOrder);
});

test('public knowledge READMEs expose every utility-first index', () => {
  const knowledgeReadme = read('knowledge/README.md');
  const agentReadme = read('knowledge/public/agent-systems/README.md');
  const graphReadme = read('knowledge/public/graphs-and-ai/README.md');

  for (const name of [
    'harnesses-index.md',
    'skills-index.md',
    'context-index.md',
  ]) {
    assert.ok(agentReadme.includes(name), `Missing agent index link: ${name}`);
  }
  assert.match(graphReadme, /\[utility-first table\]\(index\.md\)/);
  assert.match(knowledgeReadme, /Utility-first reading tables/);
});

test('index generator defines every published target and a direct PDF column', () => {
  const generator = read('scripts/build-knowledge-indexes.mjs');

  assert.match(generator, /harnesses-index\.md/);
  assert.match(generator, /skills-index\.md/);
  assert.match(generator, /context-index\.md/);
  assert.match(generator, /graphs-and-ai\/index\.md/);
  assert.match(generator, /\| Direct PDF \|/);
});
