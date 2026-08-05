import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';
import { renderLintPreset } from '../src/lint.ts';
import preset from '../lint/rxjs-friendly-preset.mjs';

const lintMessages = async (code) => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [preset],
  });
  const results = await eslint.lintText(code, { filePath: 'fixture.mjs' });
  return results[0].messages;
};

describe('eslint preset', () => {
  it('the preset file on disk matches the catalog - regenerate with npm run generate:lint', () => {
    const onDisk = readFileSync(new URL('../lint/rxjs-friendly-preset.mjs', import.meta.url), 'utf8');
    expect(onDisk.replaceAll('\r\n', '\n')).toBe(renderLintPreset());
  });

  it('flags deprecated operators with their replacement', async () => {
    const messages = await lintMessages("import { retryWhen } from 'rxjs';\n");
    expect(messages).toHaveLength(1);
    expect(messages[0].message).toContain('retry({ delay })');
  });

  it('flags renamed aliases with the friendly name', async () => {
    const messages = await lintMessages("import { distinctUntilChanged } from 'rxjs';\n");
    expect(messages).toHaveLength(1);
    expect(messages[0].message).toContain('distinctFromPrevious');
  });

  it('flags renamed partials with the composed form', async () => {
    const messages = await lintMessages("import { buffer } from 'rxjs';\n");
    expect(messages).toHaveLength(1);
    expect(messages[0].message).toContain('bufferOn');
    expect(messages[0].message).toContain('buffer(on(signal$))');
  });

  it('flags shareReplay toward shareLatest', async () => {
    const messages = await lintMessages("import { shareReplay } from 'rxjs';\n");
    expect(messages).toHaveLength(1);
    expect(messages[0].message).toContain('shareLatest()');
  });

  it('leaves kept names and vocabulary imports alone', async () => {
    const kept = await lintMessages("import { takeUntil, map, concatMap } from 'rxjs';\n");
    expect(kept).toEqual([]);
    const vocab = await lintMessages("import { bufferOn, whenAllReady } from 'rxjs-friendly';\n");
    expect(vocab).toEqual([]);
  });
});
