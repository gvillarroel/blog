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
  assert.equal(animatedTargets.length, 4);
  assert.equal(mermaidTargets.length, 4);
  assert.match(doc, /\[D3 authoring source\]\(assets\/modern-skill-evaluation\/capability-landscape\.html\)/);
  assert.match(doc, /\[D3 authoring source\]\(assets\/modern-skill-evaluation\/evaluation-evolution\.html\)/);
  assert.match(doc, /\[PlantUML C4 source\]\(assets\/modern-skill-evaluation\/evaluation-system-c4\.puml\)/);

  const targets = [
    ...figureTargets,
    ...animatedTargets,
    ...mermaidTargets,
    'assets/modern-skill-evaluation/capability-landscape.html',
    'assets/modern-skill-evaluation/capability-landscape.png',
    'assets/modern-skill-evaluation/evaluation-evolution.html',
    'assets/modern-skill-evaluation/evaluation-system-c4.puml',
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
  assert.match(d3Svg, /Paired skill lift/);
  assert.match(d3Svg, /Search \+ evolution/);
  assert.match(d3Svg, /NVIDIA SkillEvaluator/);
  assert.match(d3Svg, /not a benchmark/i);

  const d3Source = readFileSync(new URL('capability-landscape.html', assetRoot), 'utf8');
  assert.doesNotMatch(d3Source, /label:\s*["'](?:N|S|A|-)["']/);
  assert.doesNotMatch(d3Source, /\.text\(state\[[^\]]+\]\.label\)/);

  const railsSource = readFileSync(new URL('definition-railroads.mmd', assetRoot), 'utf8');
  const railsSvg = readFileSync(new URL('definition-railroads.static.svg', assetRoot), 'utf8');
  assert.match(railsSource, /railroad-ebnf-beta/);
  assert.match(railsSource, /model =/);
  assert.match(railsSource, /agent_harness =/);
  assert.match(railsSource, /skill =/);
  assert.match(railsSource, /evaluation =/);
  assert.doesNotMatch(railsSource, /model weights|fixed model API/i);
  assert.match(railsSvg, /class="railroad-diagram"/);
  assert.match(railsSvg, /background-color: white/);
  assert.match(railsSvg, /aria-describedby="chart-desc-my-svg"/);
});

test('visuals use embedded light backgrounds and high-contrast authored palettes', () => {
  for (const target of [...mermaidTargets]) {
    const source = readFileSync(new URL(target.split('/').at(-1), assetRoot), 'utf8');
    assert.match(source, /(?:"background"|background):\s*"#ffffff"/);
    assert.match(source, /(?:"primaryTextColor"|primaryTextColor):\s*"#(?:111827|333e48)"/i);
    assert.doesNotMatch(source, /#0c111b|#172033|#111927|#f3f6fb/i);
  }

  for (const name of ['capability-landscape.html']) {
    const source = readFileSync(new URL(name, assetRoot), 'utf8');
    assert.match(source, /background: #ffffff/);
  }

  for (const name of [
    'evaluation-evolution.static.svg',
    'promotion-loop.static.svg',
    'selection-guide.static.svg',
    'wikiskill-loop.static.svg',
  ]) {
    const source = readFileSync(new URL(name, assetRoot), 'utf8');
    assert.match(source, /data-diagram-background="light"/);
  }

  const c4Svg = readFileSync(new URL('evaluation-system-c4.svg', assetRoot), 'utf8');
  assert.match(c4Svg, /<svg\b/);
  assert.match(c4Svg, /viewBox="0 0 1799 830"/);
  assert.match(c4Svg, /#FFFFFF|#ffffff/);
  assert.match(c4Svg, /Promotion.*authority/s);

  const railroadSvg = readFileSync(new URL('definition-railroads.static.svg', assetRoot), 'utf8');
  assert.match(railroadSvg, /background-color: white/);
  assert.match(railroadSvg, /<title\b[^>]*>Four artifact definitions/);
  assert.match(railroadSvg, /<desc\b/);

  for (const name of [
    'treatment-boundary-editorial-colorset2-v1.png',
    'evaluation-system-editorial-colorset2-v1.png',
  ]) {
    assert.ok(existsSync(new URL(name, assetRoot)), `Missing editorial image: ${name}`);
  }
});

test('substantive report paragraphs carry paired public-source links', () => {
  const authoredBody = doc.split('\n## References\n', 1)[0];
  const blocks = authoredBody.split(/\r?\n\s*\r?\n/);
  const uncited = [];

  for (const block of blocks) {
    const text = block.replace(/\r?\n/g, ' ').trim();
    if (
      text.length < 50 ||
      /^(?:#{1,6}\s|!\[|\||```|---|\s*(?:[-*+] |\d+\. ))/.test(text) ||
      /^\[[^\]]+\]\([^)]+\)(?:\s*\|\s*\[[^\]]+\]\([^)]+\))*$/.test(text)
    ) {
      continue;
    }

    const sourceCount = (text.match(/https:\/\//g) ?? []).length;
    if (sourceCount < 2) uncited.push(text.slice(0, 140));
  }

  assert.deepEqual(uncited, []);
});

test('comparison covers the intended open and proprietary framework set', () => {
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
    assert.ok(doc.includes(framework), `Missing framework: ${framework}`);
  }

  assert.match(doc, /Public on GitHub[^\n]+not a license/i);
  assert.match(doc, /source available, not OSI open source/i);
  assert.match(doc, /LangSmith \| Proprietary/);
  assert.match(doc, /SkillOpt[^\n]+Microsoft/);
  assert.match(doc, /SkillOps[^\n]+Emory\/UIUC/);
});

test('modern evaluation pillars and auditable promotion controls remain complete without the removed contract chapter', () => {
  const pillars = [...doc.matchAll(/^\d+\. \*\*[^*]+\.\*\*/gm)];
  assert.equal(pillars.length, 10);

  for (const required of [
    'complete skill bundle',
    'discovery, development, validation, and holdout',
    'sealed holdout',
    'semantic failure',
    'provider, infrastructure',
    'Raw traces, accumulated knowledge, and the executable skill',
    'independent promotion',
    'paired no-skill/with-skill condition',
  ]) {
    assert.ok(doc.includes(required), `Missing study control: ${required}`);
  }
  assert.doesNotMatch(doc, /Minimal auditable study contract|```yaml/);
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
