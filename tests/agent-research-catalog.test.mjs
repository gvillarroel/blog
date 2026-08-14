import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const researchRoot = resolve(repositoryRoot, 'knowledge/public/agent-systems');
const bootstrapPath = resolve(repositoryRoot, 'scripts/bootstrap-agent-research.ps1');
const discoveryPath = resolve(repositoryRoot, 'scripts/discover-agent-research.ps1');

const domains = [
  {
    key: 'agent-harnesses',
    nextKey: 'agent-skills',
    document: 'harnesses.md',
    expectedCount: 79,
  },
  {
    key: 'agent-skills',
    nextKey: 'agent-context',
    document: 'skills.md',
    expectedCount: 32,
  },
  {
    key: 'agent-context',
    nextKey: null,
    document: 'context.md',
    expectedCount: 31,
  },
];

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function arxivIds(markdown, linkKind) {
  const expression = new RegExp(
    `https://arxiv\\.org/${linkKind}/(\\d{4}\\.\\d{4,5})`,
    'g',
  );
  return [...markdown.matchAll(expression)].map((match) => match[1]);
}

function manifestIds(script, domain) {
  const startMarker = `'${domain.key}' = @(`;
  const start = script.indexOf(startMarker);
  assert.notEqual(start, -1, `Missing ${domain.key} manifest block`);

  const end = domain.nextKey
    ? script.indexOf(`'${domain.nextKey}' = @(`, start)
    : script.indexOf('\n}', start);
  assert.notEqual(end, -1, `Unterminated ${domain.key} manifest block`);

  return [...script.slice(start, end).matchAll(/'(\d{4}\.\d{4,5})'/g)].map(
    (match) => match[1],
  );
}

test('agent research Markdown and executable manifests remain aligned', () => {
  const bootstrap = readFileSync(bootstrapPath, 'utf8');

  for (const domain of domains) {
    const markdown = readFileSync(resolve(researchRoot, domain.document), 'utf8');
    const manifest = manifestIds(bootstrap, domain);
    const abstracts = arxivIds(markdown, 'abs');
    const pdfs = arxivIds(markdown, 'pdf');

    assert.equal(
      manifest.length,
      domain.expectedCount,
      `${domain.key} manifest count changed; update the documented count intentionally`,
    );
    assert.equal(
      sortedUnique(manifest).length,
      manifest.length,
      `${domain.key} contains duplicate arXiv IDs`,
    );
    assert.deepEqual(
      sortedUnique(abstracts),
      sortedUnique(manifest),
      `${domain.document} abstract links differ from the executable manifest`,
    );
    assert.deepEqual(
      sortedUnique(pdfs),
      sortedUnique(manifest),
      `${domain.document} PDF links differ from the executable manifest`,
    );
  }
});

test('known withdrawn work is documented but never downloaded', () => {
  const bootstrap = readFileSync(bootstrapPath, 'utf8');
  const screening = readFileSync(resolve(researchRoot, 'screening.md'), 'utf8');

  assert.doesNotMatch(bootstrap, /'2605\.11030'/);
  assert.match(screening, /2605\.11030/);
  assert.match(screening, /Withdrawn/i);
});

test('research index reports the executable domain counts', () => {
  const index = readFileSync(resolve(researchRoot, 'README.md'), 'utf8');

  for (const domain of domains) {
    assert.match(
      index,
      new RegExp(
        '\\| \\[`' + domain.key + '`\\].*\\| ' + domain.expectedCount + ' \\|',
      ),
      `README count missing for ${domain.key}`,
    );
  }
});

test('screening snapshot retains the executable discovery vocabulary and counts', () => {
  const discovery = readFileSync(discoveryPath, 'utf8');
  const screening = readFileSync(resolve(researchRoot, 'screening.md'), 'utf8');
  const queryExpressions = [
    'all:"agent harness"',
    'all:"agent skills"',
    'all:"skill evolution" AND all:agent',
    'all:"context engineering" AND all:agent',
    'all:"long-horizon agents"',
    'all:"tool-using agents"',
    '(ti:harness OR ti:harnesses OR ti:scaffold)',
    '(ti:skill OR ti:skills) AND all:agent',
    '(ti:context OR ti:memory OR ti:compaction) AND all:agent',
  ];

  for (const expression of queryExpressions) {
    assert.ok(discovery.includes(expression), `Discovery query missing: ${expression}`);
    assert.ok(screening.includes(`\`${expression}\``), `Screening query missing: ${expression}`);
  }

  assert.match(screening, /841 deduplicated 2026 candidates/);
  assert.match(screening, /2,611 deduplicated candidates/);
  assert.match(screening, /89 unique 2026 papers/);
});
