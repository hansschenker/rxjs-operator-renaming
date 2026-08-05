import { writeFileSync } from 'node:fs';
import { renderMigration } from '../src/migration.ts';

const target = new URL('../MIGRATION.md', import.meta.url);
writeFileSync(target, renderMigration());
console.log('MIGRATION.md generated');
