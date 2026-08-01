import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const plantumlRoot = dirname(require.resolve('plantuml-cli/package.json'));
const plantumlJarName = readdirSync(join(plantumlRoot, 'build')).find((name) =>
  name.endsWith('.jar'),
);
if (!plantumlJarName) throw new Error('The PlantUML CLI package does not contain a JAR.');
const plantumlJar = join(plantumlRoot, 'build', plantumlJarName);

const DIAGRAM_LANGUAGES = new Set(['mermaid', 'echarts', 'd3', 'plantuml']);

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeJsonScript(value) {
  return value
    .replaceAll('&', '\\u0026')
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e');
}

function sourceDisclosure(language, source) {
  return `<details class="diagram-source"><summary>View ${language} source</summary><pre><code>${escapeHtml(source)}</code></pre></details>`;
}

function renderPlantUml(source) {
  const document = source.includes('@startuml')
    ? source
    : `@startuml\n${source}\n@enduml`;
  const rendered = spawnSync(
    'java',
    [
      '-jar',
      plantumlJar,
      '--svg',
      '--pipe',
      '--no-error-image',
      '--stop-on-error',
    ],
    {
      input: document,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, PLANTUML_SECURITY_PROFILE: 'SECURE' },
    },
  );

  if (rendered.error || rendered.status !== 0) {
    const detail = rendered.stderr?.trim() || rendered.error?.message || 'unknown error';
    throw new Error(`PlantUML rendering failed: ${detail}`);
  }

  const start = rendered.stdout.indexOf('<svg');
  const end = rendered.stdout.lastIndexOf('</svg>');
  if (start < 0 || end < start) {
    throw new Error('PlantUML did not return a complete SVG document.');
  }
  const svg = rendered.stdout.slice(start, end + '</svg>'.length);
  if (/<script\b|<foreignObject\b|\bon\w+\s*=|javascript:/i.test(svg)) {
    throw new Error('PlantUML returned unsafe SVG markup.');
  }
  return svg;
}

function renderDiagram(language, source) {
  if (language === 'mermaid') {
    return [
      '<figure class="diagram" data-diagram="mermaid">',
      `<pre class="mermaid">${escapeHtml(source)}</pre>`,
      sourceDisclosure(language, source),
      '</figure>',
    ].join('');
  }

  if (language === 'plantuml') {
    return [
      '<figure class="diagram" data-diagram="plantuml" role="img" aria-label="PlantUML diagram">',
      renderPlantUml(source),
      sourceDisclosure(language, source),
      '</figure>',
    ].join('');
  }

  const payload = escapeJsonScript(source);
  return [
    `<figure class="diagram" data-diagram="${language}">`,
    '<div class="diagram-canvas" role="img" aria-label="Technical diagram"></div>',
    `<script type="application/json" data-diagram-payload>${payload}</script>`,
    sourceDisclosure(language, source),
    '</figure>',
  ].join('');
}

function visit(node) {
  if (!node || typeof node !== 'object') return;

  if (node.type === 'code') {
    const language = String(node.lang ?? '').toLowerCase();
    if (DIAGRAM_LANGUAGES.has(language)) {
      node.type = 'html';
      node.value = renderDiagram(language, String(node.value ?? ''));
      delete node.lang;
      delete node.meta;
      return;
    }
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(visit);
  }
}

export function diagramFences() {
  return (tree) => visit(tree);
}
