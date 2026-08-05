import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderMigration } from '../src/migration';

describe('migration table', () => {
  it('MIGRATION.md matches the catalog — regenerate with npm run generate:migration', () => {
    const onDisk = readFileSync(new URL('../MIGRATION.md', import.meta.url), 'utf8');
    expect(onDisk.replaceAll('\r\n', '\n')).toBe(renderMigration());
  });

  it('renders both directions', () => {
    const md = renderMigration();
    expect(md).toContain('## Official → vocabulary');
    expect(md).toContain('## Vocabulary → official');
    expect(md).toContain('`distinctUntilChanged` | `distinctFromPrevious`');
    expect(md).toContain('`bufferOn` | `buffer`');
  });
});
