import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const researchRoot = resolve(repositoryRoot, 'knowledge/public/graphs-and-ai');
const catalogPath = resolve(researchRoot, 'catalog.json');
const papersPath = resolve(researchRoot, 'papers.md');
const readmePath = resolve(researchRoot, 'README.md');
const screeningPath = resolve(researchRoot, 'screening.md');
const bootstrapPath = resolve(repositoryRoot, 'scripts/bootstrap-graphs-and-ai.ps1');
const discoveryPath = resolve(repositoryRoot, 'scripts/discover-graphs-and-ai.ps1');
const validatorPath = resolve(repositoryRoot, 'scripts/validate-graphs-and-ai.ps1');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const papersMarkdown = readFileSync(papersPath, 'utf8');

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function linkedIds(kind) {
  const expression = new RegExp(
    `https://arxiv\\.org/${kind}/(\\d{4}\\.\\d{4,5})`,
    'g',
  );
  return [...papersMarkdown.matchAll(expression)].map((match) => match[1]);
}

test('graphs-and-ai catalog has the declared shape and dated counts', () => {
  assert.equal(catalog.schemaVersion, '1.0');
  assert.equal(catalog.domain, 'graphs-and-ai');
  assert.equal(catalog.cutoff, '2026-08-14T23:59:59Z');
  assert.equal(catalog.papers.length, 109);
  assert.equal(catalog.selection.papers, 109);
  assert.equal(catalog.papers.filter((paper) => paper.year === 2026).length, 39);
  assert.equal(catalog.selection.papers2026, 39);
  assert.equal(catalog.selection.priorYearAnchors, 70);
  assert.equal(catalog.trustedSources.length, 5);
  assert.equal(catalog.selection.trustedWebSources, 5);
  assert.equal(catalog.selection.totalSources, 114);
  assert.equal(sortedUnique(catalog.papers.map((paper) => paper.id)).length, 109);
});

test('every catalog entry has valid identity, provenance class, and rationale', () => {
  const allowedEvidence = new Set(['anchor', 'current-strong']);

  for (const paper of catalog.papers) {
    assert.match(paper.id, /^\d{4}\.\d{4,5}$/);
    assert.equal(paper.year, 2000 + Number.parseInt(paper.id.slice(0, 2), 10));
    assert.ok(paper.title.trim().length > 5, `Missing title for ${paper.id}`);
    assert.ok(paper.section.trim().length > 5, `Missing section for ${paper.id}`);
    assert.ok(paper.reason.trim().length > 15, `Missing rationale for ${paper.id}`);
    assert.ok(allowedEvidence.has(paper.evidence), `Bad evidence class for ${paper.id}`);
    assert.equal(
      paper.evidence,
      paper.year === 2026 ? 'current-strong' : 'anchor',
      `Evidence class and year disagree for ${paper.id}`,
    );
  }
});

test('trusted web references are primary, unique, and reproducibly bounded', () => {
  assert.equal(
    sortedUnique(catalog.trustedSources.map((source) => source.id)).length,
    catalog.trustedSources.length,
  );

  for (const source of catalog.trustedSources) {
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.title.trim().length > 5);
    assert.ok(source.purpose.trim().length > 20);
    assert.ok(Number.isInteger(source.maxDepth) && source.maxDepth >= 0);
    assert.ok(Number.isInteger(source.maxPages) && source.maxPages >= 1);
  }
});

test('Markdown abstract and PDF links exactly match the executable catalog', () => {
  const manifestIds = sortedUnique(catalog.papers.map((paper) => paper.id));
  const abstractIds = linkedIds('abs');
  const pdfIds = linkedIds('pdf');

  assert.equal(abstractIds.length, 109);
  assert.equal(pdfIds.length, 109);
  assert.deepEqual(sortedUnique(abstractIds), manifestIds);
  assert.deepEqual(sortedUnique(pdfIds), manifestIds);
});

test('the requested graph theory reference is retained as a foundation', () => {
  const paper = catalog.papers.find((candidate) => candidate.id === '2308.04512');
  assert.ok(paper);
  assert.equal(paper.title, 'An introduction to graph theory');
  assert.equal(paper.section, 'Mathematical and conceptual foundations');
});

test('expanded discovery admits the four manually screened 2026 papers', () => {
  const expectedIds = ['2602.06319', '2605.07133', '2605.10366', '2606.24980'];

  for (const id of expectedIds) {
    const paper = catalog.papers.find((candidate) => candidate.id === id);
    assert.ok(paper, `Missing screened paper ${id}`);
    assert.equal(paper.year, 2026);
    assert.equal(paper.evidence, 'current-strong');
  }
});

test('bootstrap and documentation retain reproducible scope controls', () => {
  const bootstrap = readFileSync(bootstrapPath, 'utf8');
  const discovery = readFileSync(discoveryPath, 'utf8');
  const screening = readFileSync(screeningPath, 'utf8');
  const readme = readFileSync(readmePath, 'utf8');
  const validator = readFileSync(validatorPath, 'utf8');
  const requiredQueries = [
    'all:"graph foundation model"',
    '(all:GraphRAG OR all:"graph retrieval augmented generation" OR all:"graph-augmented RAG" OR all:"graph augmented RAG")',
    'all:"neural algorithmic reasoning"',
    '(ti:"graph algorithm" OR ti:"graph algorithms") AND (all:neural OR all:"large language model" OR all:LLM)',
    'all:"graph neural network" AND (ti:benchmark OR ti:evaluation)',
    '(all:"large language model" OR all:LLM) AND (ti:"graph property" OR ti:"graph properties" OR ti:"graph inference")',
  ];

  assert.match(bootstrap, /\$domain = 'graphs-and-ai'/);
  assert.match(bootstrap, /catalog\.json/);
  assert.match(bootstrap, /--if-missing/);
  assert.match(bootstrap, /paperIndex/);
  assert.match(readme, /114 sources/);
  assert.match(bootstrap, /add', 'site'/);
  assert.match(screening, /Low-quality work is excluded/);
  assert.match(screening, /339 deduplicated/);
  assert.match(screening, /produced \*\*377\*\*/);
  assert.match(validator, /SHA256/);
  assert.match(validator, /'%PDF-'/);
  assert.match(validator, /ReadAllText/);
  assert.match(validator, /hashtable|@\{/i);

  for (const query of requiredQueries) {
    assert.ok(discovery.includes(query), `Discovery query missing: ${query}`);
    assert.ok(screening.includes(`\`${query}\``), `Screening query missing: ${query}`);
  }
});
