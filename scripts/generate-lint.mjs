import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderLintPreset } from '../src/lint.ts';

const dir = new URL('../lint/', import.meta.url);
mkdirSync(fileURLToPath(dir), { recursive: true });
const target = new URL('rxjs-friendly-preset.mjs', dir);
writeFileSync(target, renderLintPreset());
console.log('wrote', fileURLToPath(target));
