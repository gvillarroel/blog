import assert from 'node:assert/strict';
import test from 'node:test';

import { diagramFences } from '../src/remark/diagram-fences.mjs';

function transform(language, value) {
  const node = { type: 'root', children: [{ type: 'code', lang: language, value }] };
  diagramFences()(node);
  return node.children[0];
}

test('turns Mermaid fences into progressive-enhancement markup', () => {
  const node = transform('mermaid', 'flowchart LR\nA --> B');
  assert.equal(node.type, 'html');
  assert.match(node.value, /data-diagram="mermaid"/);
  assert.match(node.value, /View mermaid source/);
});

test('escapes executable markup in JSON diagram payloads', () => {
  const node = transform('echarts', '{"title":{"text":"</script>"}}');
  assert.equal(node.type, 'html');
  assert.doesNotMatch(node.value, /<\/script>"/);
  assert.match(node.value, /\\u003c\/script\\u003e/);
});

test('renders PlantUML to a self-contained safe SVG', () => {
  const node = transform('plantuml', 'Alice -> Bob: hello');
  assert.equal(node.type, 'html');
  assert.match(node.value, /<svg\b/);
  assert.doesNotMatch(node.value, /https:\/\/(?:kroki|www\.plantuml)\./);
  assert.doesNotMatch(node.value, /<script\b|<foreignObject\b|javascript:/i);
  assert.match(node.value, /View plantuml source/);
});

test('leaves ordinary code fences untouched', () => {
  const node = transform('typescript', 'const value = 1;');
  assert.equal(node.type, 'code');
});
