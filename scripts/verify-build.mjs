import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const required = [
  'dist/index.html',
  'dist/404.html',
  'dist/rss.xml',
  'dist/sitemap-index.xml',
];

for (const relative of required) {
  if (!existsSync(resolve(root, relative))) {
    throw new Error(`Missing build artifact: ${relative}`);
  }
}

const index = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
if (!index.includes('/blog/_astro/')) {
  throw new Error('Built asset URLs do not include the GitHub Pages base path.');
}
if (index.includes('LangChain: a framework map')) {
  throw new Error('Draft content leaked into the production post index.');
}

const trackedPrivate = execFileSync(
  'git',
  ['ls-files', 'knowledge/expert-sources', 'knowledge/private-sources', '*.pdf', '*.epub'],
  { cwd: root, encoding: 'utf8' },
).trim();
if (trackedPrivate) {
  throw new Error(`Private source material is tracked:\n${trackedPrivate}`);
}

console.log('Build, base path, draft filtering, and private-source boundary verified.');
