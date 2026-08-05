import { describe, expect, it } from 'vitest';
import * as rx from 'rxjs';
import * as vocab from '../src/index';
import { catalog, keptOfficialNames } from '../src/catalog';

const vocabExports = vocab as unknown as Record<string, unknown>;
const rxExports = rx as unknown as Record<string, unknown>;

describe('catalog consistency', () => {
  it('every non-excluded entry is exported from the package index', () => {
    for (const entry of catalog) {
      if (entry.kind === 'excluded') continue;
      expect(vocabExports[entry.friendly], `missing export: ${entry.friendly}`).toBeDefined();
    }
  });

  it('pure aliases are identical to the official rxjs export', () => {
    for (const entry of catalog) {
      if (entry.kind !== 'alias') continue;
      expect(
        vocabExports[entry.friendly],
        `${entry.friendly} should be rxjs ${String(entry.official)}`,
      ).toBe(rxExports[entry.official as string]);
    }
  });

  it('kept official names are re-exported unchanged', () => {
    for (const name of keptOfficialNames) {
      expect(vocabExports[name], `kept name not re-exported: ${name}`).toBe(rxExports[name]);
    }
  });

  it('no alias, partial, or wrapper name shadows an rxjs export', () => {
    for (const entry of catalog) {
      if (entry.kind !== 'alias' && entry.kind !== 'partial' && entry.kind !== 'wrapper') continue;
      expect(
        Object.hasOwn(rx, entry.friendly),
        `${entry.friendly} collides with an existing rxjs export`,
      ).toBe(false);
    }
  });

  it('roots and the count boundary shadow rxjs exports by design — and nothing else does', () => {
    const intentionalShadows = new Set([
      'take',
      'skip',
      'buffer',
      'window',
      'debounce',
      'throttle',
      'audit',
      'sample',
      'count',
    ]);
    for (const entry of catalog) {
      if (entry.kind !== 'root' && entry.kind !== 'boundary') continue;
      if (Object.hasOwn(rx, entry.friendly)) {
        expect(
          intentionalShadows.has(entry.friendly),
          `${entry.friendly} shadows rxjs unexpectedly`,
        ).toBe(true);
      }
    }
  });

  it('excluded operators never appear as vocabulary exports', () => {
    for (const entry of catalog) {
      if (entry.kind !== 'excluded') continue;
      expect(
        vocabExports[entry.friendly],
        `excluded operator leaked into the vocabulary: ${entry.friendly}`,
      ).toBeUndefined();
    }
  });
});
