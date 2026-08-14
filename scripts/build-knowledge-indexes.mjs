import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const agentCatalogs = [
  {
    domain: 'Harnesses',
    source: 'knowledge/public/agent-systems/harnesses.md',
    target: 'knowledge/public/agent-systems/harnesses-index.md',
    expectedCount: 79,
    startHere: [
      '2605.27922',
      '2607.12227',
      '2604.25850',
      '2601.11868',
      '2602.00933',
      '2603.14465',
      '2604.16706',
      '2608.00267',
      '2608.01964',
      '2310.06770',
      '2405.15793',
      '2503.14499',
      '2504.01848',
      '2507.19457',
      '2606.09498',
      '2608.09096',
    ],
  },
  {
    domain: 'Skills',
    source: 'knowledge/public/agent-systems/skills.md',
    target: 'knowledge/public/agent-systems/skills-index.md',
    expectedCount: 32,
    startHere: [
      '2602.12670',
      '2606.15390',
      '2601.10338',
      '2602.08004',
      '2604.04323',
      '2605.24117',
      '2608.04828',
      '2601.21557',
      '2604.01687',
      '2605.23904',
      '2608.02636',
      '2604.03070',
      '2303.11366',
      '2305.16291',
      '2504.07079',
    ],
  },
  {
    domain: 'Context',
    source: 'knowledge/public/agent-systems/context.md',
    target: 'knowledge/public/agent-systems/context-index.md',
    expectedCount: 31,
    startHere: [
      '2602.16069',
      '2607.09691',
      '2607.27250',
      '2607.25398',
      '2601.10402',
      '2604.01664',
      '2605.20833',
      '2606.15903',
      '2607.05378',
      '2607.23809',
      '2005.11401',
      '2307.03172',
      '2310.08560',
      '2404.13208',
      '2406.13352',
      '2410.10813',
      '2510.04618',
      '2512.22087',
    ],
  },
];

const graphStartHere = [
  '2104.13478',
  '1806.01261',
  '1901.00596',
  '2308.04512',
  '1609.02907',
  '1706.02216',
  '1710.10903',
  '1810.00826',
  '1811.05868',
  '2005.00687',
  '2006.05205',
  '2206.08164',
  '2003.02320',
  '2106.06935',
  '2105.02761',
  '2205.15659',
  '2305.10037',
  '2310.04560',
  '2404.16130',
  '2402.07630',
  '2502.11371',
  '2604.09666',
  '2607.16604',
  '2606.24509',
  '2603.10033',
  '2602.06319',
  '2606.24980',
  '2605.10366',
  '2605.06462',
  '2605.07133',
];

const graphSectionOrder = [
  '2026 evaluation, robustness, and diagnostics',
  '2026 GraphRAG and structured retrieval',
  '2026 graph foundation models and transfer',
  '2026 graph and algorithmic reasoning',
  'Evaluation, benchmarks, and failure modes',
  'LLMs, GraphRAG, and graph foundation models',
  'Mathematical and conceptual foundations',
  'Graph representation learning',
  'Transformers, dynamic graphs, and long-range models',
  'Knowledge graphs and relational reasoning',
  'Neural algorithmic reasoning',
  'Graph generation',
];

const gradePriority = new Map([
  ['A', { label: 'Essential', order: 1 }],
  ['B', { label: 'Useful', order: 2 }],
  ['R', { label: 'Reference', order: 3 }],
]);

function escapeTableCell(value) {
  return String(value)
    .replaceAll('|', '\\|')
    .replaceAll('\r', ' ')
    .replaceAll('\n', ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function yearFromArxivId(id) {
  return 2000 + Number.parseInt(id.slice(0, 2), 10);
}

function normalizeTopic(section) {
  return section
    .replace(/^2026:\s*/, '')
    .replace(/^Prior work:\s*/, 'Prior: ')
    .trim();
}

function parseAgentCatalog(markdown, sourceName) {
  const entries = [];
  let section = '';

  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('## ')) {
      section = line.slice(3).trim();
      continue;
    }

    let match = line.match(
      /^\| ([ABR]) \| \[(.+?)\]\(https:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})\) · \[PDF\]\(https:\/\/arxiv\.org\/pdf\/\3\) \| (.+) \|$/,
    );
    if (match) {
      entries.push({
        grade: match[1],
        title: match[2],
        id: match[3],
        reason: match[4],
        section,
        year: yearFromArxivId(match[3]),
      });
      continue;
    }

    match = line.match(
      /^\| (20\d{2}) \| \[(.+?)\]\(https:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})\) · \[PDF\]\(https:\/\/arxiv\.org\/pdf\/\3\) \| (.+) \|$/,
    );
    if (match) {
      entries.push({
        grade: 'A',
        title: match[2],
        id: match[3],
        reason: match[4],
        section,
        year: Number.parseInt(match[1], 10),
      });
    }
  }

  const ids = new Set(entries.map(({ id }) => id));
  if (ids.size !== entries.length) {
    throw new Error(`${sourceName} contains duplicate arXiv IDs.`);
  }
  return entries;
}

function rankAgentEntries(entries, startHere, sourceName) {
  const entryIds = new Set(entries.map(({ id }) => id));
  for (const id of startHere) {
    if (!entryIds.has(id)) {
      throw new Error(`${sourceName} start-here ID is missing: ${id}`);
    }
  }

  const startOrder = new Map(startHere.map((id, index) => [id, index]));
  return entries
    .map((entry) => {
      const startIndex = startOrder.get(entry.id);
      const grade = gradePriority.get(entry.grade);
      if (!grade) {
        throw new Error(`Unknown evidence grade ${entry.grade} for ${entry.id}.`);
      }
      return {
        ...entry,
        priority: startIndex === undefined ? grade.label : 'Start here',
        priorityOrder: startIndex === undefined ? grade.order : 0,
        withinPriority: startIndex ?? 0,
      };
    })
    .sort(
      (left, right) =>
        left.priorityOrder - right.priorityOrder ||
        left.withinPriority - right.withinPriority ||
        right.year - left.year ||
        left.title.localeCompare(right.title),
    );
}

function renderIndex({ title, sourceLink, cutoff, entries, priorityLegend }) {
  const lines = [
    `# ${title}`,
    '',
    `This is the utility-first reading order for [the complete annotated catalog](${sourceLink}).`,
    `It preserves every retained paper at the **${cutoff}** cutoff and exposes the`,
    'downloadable arXiv PDF as a separate direct link.',
    '',
    `Priority is editorial rather than a claim of universal quality: ${priorityLegend}`,
    'Within each tier, broader decision value, stronger evaluation, and current',
    'operational relevance come before narrower contributions.',
    '',
    '| Rank | Priority | Year | Paper | Direct PDF | Topic | Why useful |',
    '|---:|---|---:|---|---|---|---|',
  ];

  entries.forEach((entry, index) => {
    const abstractUrl = `https://arxiv.org/abs/${entry.id}`;
    const pdfUrl = `https://arxiv.org/pdf/${entry.id}`;
    lines.push(
      `| ${index + 1} | ${entry.priority} | ${entry.year} | [${escapeTableCell(entry.title)}](${abstractUrl}) | [PDF](${pdfUrl}) | ${escapeTableCell(normalizeTopic(entry.section))} | ${escapeTableCell(entry.reason)} |`,
    );
  });

  return `${lines.join('\n')}\n`;
}

function buildAgentIndexes() {
  for (const catalog of agentCatalogs) {
    const sourcePath = resolve(repositoryRoot, catalog.source);
    const markdown = readFileSync(sourcePath, 'utf8');
    const entries = parseAgentCatalog(markdown, catalog.source);
    if (entries.length !== catalog.expectedCount) {
      throw new Error(
        `${catalog.source} yielded ${entries.length} papers; expected ${catalog.expectedCount}.`,
      );
    }

    const ranked = rankAgentEntries(entries, catalog.startHere, catalog.source);
    const rendered = renderIndex({
      title: `${catalog.domain}: utility-first paper index`,
      sourceLink: catalog.source.split('/').at(-1),
      cutoff: '2026-08-13',
      entries: ranked,
      priorityLegend:
        '**Start here** is the shortest high-value path, **Essential** is grade-A evidence, **Useful** is narrower or provisional grade-B evidence, and **Reference** is survey or specification material.',
    });
    writeFileSync(resolve(repositoryRoot, catalog.target), rendered, 'utf8');
  }
}

function buildGraphIndex() {
  const catalogPath = resolve(
    repositoryRoot,
    'knowledge/public/graphs-and-ai/catalog.json',
  );
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  const paperIds = new Set(catalog.papers.map(({ id }) => id));
  for (const id of graphStartHere) {
    if (!paperIds.has(id)) {
      throw new Error(`Graphs and AI start-here ID is missing: ${id}`);
    }
  }

  const startOrder = new Map(graphStartHere.map((id, index) => [id, index]));
  const sectionOrder = new Map(
    graphSectionOrder.map((section, index) => [section, index]),
  );
  const ranked = catalog.papers
    .map((paper) => {
      const startIndex = startOrder.get(paper.id);
      const isCurrent = paper.evidence === 'current-strong';
      return {
        ...paper,
        priority:
          startIndex !== undefined
            ? 'Start here'
            : isCurrent
              ? 'Current strong'
              : 'Foundation',
        priorityOrder: startIndex !== undefined ? 0 : isCurrent ? 1 : 2,
        withinPriority:
          startIndex ?? sectionOrder.get(paper.section) ?? graphSectionOrder.length,
      };
    })
    .sort(
      (left, right) =>
        left.priorityOrder - right.priorityOrder ||
        left.withinPriority - right.withinPriority ||
        right.year - left.year ||
        left.title.localeCompare(right.title),
    );

  const rendered = renderIndex({
    title: 'Graphs and AI: utility-first paper index',
    sourceLink: 'papers.md',
    cutoff: '2026-08-14',
    entries: ranked,
    priorityLegend:
      '**Start here** is a curated cross-topic path, **Current strong** is high-value 2026 evidence, and **Foundation** is durable prior work.',
  });
  writeFileSync(
    resolve(repositoryRoot, 'knowledge/public/graphs-and-ai/index.md'),
    rendered,
    'utf8',
  );
}

buildAgentIndexes();
buildGraphIndex();
