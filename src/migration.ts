import { catalog, keptOfficialNames } from './catalog';
import type { CatalogEntry } from './catalog';

/**
 * Renders MIGRATION.md from the catalog — both directions, so the file can
 * never drift from the source of truth. Regenerate with
 * `npm run generate:migration`; `tests/migration.spec.ts` fails when the file
 * on disk is stale.
 */

const code = (s: string): string => `\`${s}\``;

interface Row {
  readonly left: string;
  readonly right: string;
  readonly kind: string;
  readonly notes: string;
}

const renderTable = (headers: readonly [string, string, string, string], rows: readonly Row[]): string[] => [
  `| ${headers[0]} | ${headers[1]} | ${headers[2]} | ${headers[3]} |`,
  '| --- | --- | --- | --- |',
  ...rows.map((r) => `| ${r.left} | ${r.right} | ${r.kind} | ${r.notes} |`),
];

const notesFor = (e: CatalogEntry): string =>
  e.composed ? `${code(e.composed)} — ${e.behavior}` : e.behavior;

export function renderMigration(): string {
  const renamed = catalog.filter(
    (e): e is CatalogEntry & { official: string } =>
      e.official !== null && (e.kind === 'alias' || e.kind === 'partial' || e.kind === 'wrapper'),
  );
  const excluded = catalog.filter((e) => e.kind === 'excluded');

  const officialRows: Row[] = [
    ...renamed.map((e) => ({
      left: code(e.official),
      right: code(e.friendly),
      kind: e.kind,
      notes: notesFor(e),
    })),
    ...keptOfficialNames.map((name) => ({
      left: code(name),
      right: code(name),
      kind: 'keep',
      notes: 'Official name already obeys the suffix grammar.',
    })),
    ...excluded.map((e) => ({
      left: code(e.official ?? e.friendly),
      right: '—',
      kind: 'excluded',
      notes: e.behavior,
    })),
  ].sort((a, b) => a.left.localeCompare(b.left));

  const friendlyRows: Row[] = [
    ...catalog
      .filter((e) => e.kind !== 'excluded')
      .map((e) => ({
        left: code(e.friendly),
        right: e.official === null ? '—' : code(e.official),
        kind: e.kind,
        notes: notesFor(e),
      })),
    ...keptOfficialNames.map((name) => ({
      left: code(name),
      right: code(name),
      kind: 'keep',
      notes: 'Re-exported unchanged.',
    })),
  ].sort((a, b) => a.left.localeCompare(b.left));

  const lines: string[] = [
    '# Migration Tables',
    '',
    '> Generated from `src/catalog.ts` by `npm run generate:migration` — do not edit by hand.',
    '',
    `Summary: ${renamed.length} renamed, ${keptOfficialNames.length} kept, ${excluded.length} excluded.`,
    '',
    '## Official → vocabulary',
    '',
    ...renderTable(['Official (rxjs)', 'Vocabulary', 'Kind', 'Notes'], officialRows),
    '',
    '## Vocabulary → official',
    '',
    'Boundaries and curried roots have no single official counterpart — the root',
    'dispatches to a different official operator per boundary kind (see the README',
    'suffix grammar).',
    '',
    ...renderTable(['Vocabulary', 'Official (rxjs)', 'Kind', 'Notes'], friendlyRows),
    '',
  ];
  return lines.join('\n');
}
