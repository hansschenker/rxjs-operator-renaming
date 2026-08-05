import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { catalog } from '../src/catalog.ts';
import { GROUPS, exampleFor, kindLine, renderStory } from '../src/docs.ts';

// Renders docs/vocabulary.md for this repo's own VitePress site — the same
// catalog data as generate-docs.mjs, but plain markdown (no ROperatorCard),
// so the page is self-contained and machine-readable (e.g. for NotebookLM).
// Runs as part of `npm run docs:build`; the output is gitignored.

const KIND_ORDER = { root: 0, partial: 1, alias: 2, wrapper: 3, keep: 4 };

const renderEntry = (e) => {
  const kind =
    e.kind === 'boundary'
      ? '> **Boundary combinator** — a suffix as a first-class value; the curried roots dispatch on its tag.'
      : kindLine(e);
  const lines = [`### \`${e.friendly}\``, '', kind, '', e.behavior, ''];
  const example = exampleFor(e);
  if (example !== undefined && e.kind !== 'alias') {
    lines.push('```ts', ...example.split('\\n'), '```', '');
  }
  lines.push(...renderStory(e));
  lines.push('');
  return lines;
};

const lines = [
  '---',
  'title: Operator Vocabulary',
  'outline: deep',
  '---',
  '',
  '# Operator Vocabulary',
  '',
  'Every entry below derives from `src/catalog.ts`, the single source of truth.',
  'Each operator carries its 8-policy story: Source → Trigger → Value →',
  'Cardinality → Time → Concurrency → Cancellation → Termination.',
  '',
];

for (const group of GROUPS) {
  const entries = catalog
    .filter((e) => group.families.includes(e.family) && e.kind !== 'excluded')
    .sort((a, b) => (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9));
  if (entries.length === 0) continue;
  lines.push(`## ${group.title}`, '', group.intro, '');
  for (const e of entries) lines.push(...renderEntry(e));
}

const excluded = catalog.filter((e) => e.kind === 'excluded');
lines.push('## Excluded (deprecated / out of scope)', '');
lines.push('| Official | Modern replacement |', '| --- | --- |');
for (const e of excluded) lines.push(`| \`${e.friendly}\` | ${e.behavior} |`);
lines.push('');

const out = fileURLToPath(new URL('../docs/vocabulary.md', import.meta.url));
writeFileSync(out, lines.join('\n'));
console.log('wrote', out);
