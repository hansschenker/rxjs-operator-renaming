import { catalog } from './catalog';
import type { CatalogEntry } from './catalog';

/**
 * Renders the VitePress "Operator Vocabulary" section for rxjs-vitepress-ds —
 * markdown pages using the globally registered ROperatorCard component, plus
 * the sidebar JSON imported by `.vitepress/config.mts`. Everything derives
 * from the catalog. Regenerate with `npm run generate:docs`.
 */

export interface DocsPage {
  /** Path relative to the VitePress site root, e.g. 'vocabulary/index.md'. */
  readonly path: string;
  readonly content: string;
}

interface DocsGroup {
  readonly slug: string;
  readonly title: string;
  readonly families: readonly string[];
  readonly intro: string;
}

const GROUPS: readonly DocsGroup[] = [
  {
    slug: 'boundaries',
    title: 'Boundaries',
    families: ['boundary'],
    intro:
      'The suffixes of the vocabulary as first-class values. Each boundary is a small tagged value; the curried roots dispatch on the tag to the exact official RxJS operator.',
  },
  {
    slug: 'take-skip',
    title: 'Take & Skip',
    families: ['take', 'skip'],
    intro:
      'Prefix and suffix control: keep or drop values as long as a boundary allows. `take(time(ms))` and `skip(time(ms))` are generated operators RxJS never shipped.',
  },
  {
    slug: 'buffer-window',
    title: 'Buffer & Window',
    families: ['buffer', 'window'],
    intro:
      'Collect values into arrays (buffer) or route them into inner observables (window); the boundary decides when a cycle ends.',
  },
  {
    slug: 'rate-limiting',
    title: 'Rate Limiting',
    families: ['debounce', 'throttle', 'audit', 'sample'],
    intro:
      'Every timing family reads the same way: `xxxTime(ms)` fixed clock, `xxxWhen(make)` a signal you create, `xxxOn(signal$)` an external trigger.',
  },
  {
    slug: 'timing',
    title: 'Timing',
    families: ['timing'],
    intro: 'Shifting values in time and failing slow streams.',
  },
  {
    slug: 'filtering',
    title: 'Filtering & Distinct',
    families: ['filter', 'distinct'],
    intro:
      'Value selection by predicate, position, or history. The fake-`Until` names are gone: `distinctFromPrevious` says what actually happens.',
  },
  {
    slug: 'transform',
    title: 'Transformation',
    families: ['transform'],
    intro: 'Rewriting, accumulating, pairing, and grouping values.',
  },
  {
    slug: 'flattening',
    title: 'Flattening',
    families: ['flatten'],
    intro:
      'The sacred strategy vocabulary — concat queues, switch keeps the latest, merge runs concurrently, exhaust ignores while busy. Nothing here is renamed.',
  },
  {
    slug: 'aggregates',
    title: 'Aggregates',
    families: ['aggregate'],
    intro:
      'Every aggregate declares its completion dependency in its name: nothing is emitted until the source completes.',
  },
  {
    slug: 'joining',
    title: 'Joining',
    families: ['join'],
    intro: 'Combining the source with other observables or values.',
  },
  {
    slug: 'error-utility',
    title: 'Error, Utility & Sharing',
    families: ['error', 'utility', 'share'],
    intro: 'Recovery, side effects, teardown, and multicasting.',
  },
];

/** ROperatorCard category per family — keys must exist in the card's palette. */
const CATEGORY: Readonly<Record<string, string>> = {
  take: 'Filtering',
  skip: 'Filtering',
  filter: 'Filtering',
  distinct: 'Filtering',
  debounce: 'Filtering',
  throttle: 'Filtering',
  audit: 'Filtering',
  sample: 'Filtering',
  buffer: 'Transformation',
  window: 'Transformation',
  transform: 'Transformation',
  flatten: 'Transformation',
  aggregate: 'Mathematical',
  join: 'Combination',
  timing: 'Utility',
  utility: 'Utility',
  error: 'Error',
  share: 'Multicasting',
};

const KIND_ORDER: Readonly<Record<string, number>> = {
  root: 0,
  partial: 1,
  alias: 2,
  wrapper: 3,
  keep: 4,
};

const ROOT_EXAMPLES: Readonly<Record<string, string>> = {
  take: 'take(count(3))        // rxjs take(3)\\ntake(whileTrue(p))    // rxjs takeWhile(p)\\ntake(until(stop$))    // rxjs takeUntil(stop$)\\ntake(time(5000))      // takeUntil(timer(5000))',
  skip: 'skip(count(2))        // rxjs skip(2)\\nskip(whileTrue(p))    // rxjs skipWhile(p)\\nskip(until(start$))   // rxjs skipUntil(start$)\\nskip(time(500))       // skipUntil(timer(500))',
  buffer:
    'buffer(time(1000))    // bufferTime(1000)\\nbuffer(count(5))      // bufferCount(5)\\nbuffer(on(flush$))    // rxjs buffer(flush$)\\nbuffer(when(make))    // bufferWhen(make)\\nbuffer(toggle(o$, c)) // bufferToggle(o$, c)',
  window:
    'window(time(1000))    // windowTime(1000)\\nwindow(count(5))      // windowCount(5)\\nwindow(on(split$))    // rxjs window(split$)\\nwindow(when(make))    // windowWhen(make)\\nwindow(toggle(o$, c)) // windowToggle(o$, c)',
  debounce: 'debounce(time(300))   // debounceTime(300)\\ndebounce(when(make))  // rxjs debounce(make)',
  throttle:
    'throttle(time(300))   // throttleTime(300)\\nthrottle(when(make))  // rxjs throttle(make)\\nthrottle(count(3))    // first of every 3 - generated',
  audit: 'audit(time(300))      // auditTime(300)\\naudit(when(make))     // rxjs audit(make)',
  sample:
    'sample(time(1000))    // sampleTime(1000)\\nsample(on(tick$))     // rxjs sample(tick$)\\nsample(count(3))      // last of every 3 - generated',
};

const exampleFor = (e: CatalogEntry): string | undefined => {
  switch (e.kind) {
    case 'root':
      return ROOT_EXAMPLES[e.friendly];
    case 'partial':
      return `source$.pipe(${e.friendly}(...))  // = ${e.composed ?? ''}`;
    case 'wrapper':
      return `source$.pipe(${e.friendly}())  // = ${e.composed ?? ''}`;
    case 'alias':
      return `// pure re-export of rxjs ${e.official ?? ''}`;
    default:
      return undefined;
  }
};

const kindLine = (e: CatalogEntry): string => {
  switch (e.kind) {
    case 'root':
      return '> **Curried root** — takes a boundary and dispatches to the official operator.';
    case 'partial':
      return `> **Named partial application** — composed form \`${e.composed ?? ''}\`, dispatching to rxjs \`${e.official ?? ''}\`.`;
    case 'alias':
      return `> **Pure alias** of rxjs \`${e.official ?? ''}\` — the identical function, zero runtime cost.`;
    case 'wrapper':
      return `> **Configured wrapper** — \`${e.composed ?? ''}\`.`;
    default:
      return '> **Official name, re-exported unchanged** — it already obeys the suffix grammar.';
  }
};

const renderStory = (e: CatalogEntry): string[] => {
  const s = e.story;
  if (!s) return [];
  return [
    '| Policy | Story |',
    '| --- | --- |',
    `| **Source** | ${s.source} |`,
    `| **Trigger** | ${s.trigger} |`,
    `| **Value** | ${s.value} |`,
    `| **Cardinality** | ${s.cardinality} |`,
    `| **Time** | ${s.time} |`,
    `| **Concurrency** | ${s.concurrency} |`,
    `| **Cancellation** | ${s.cancellation} |`,
    `| **Termination** | ${s.termination} |`,
  ];
};

const renderEntry = (e: CatalogEntry): string[] => {
  const category = CATEGORY[e.family] ?? 'Utility';
  const example = exampleFor(e);
  const exampleAttr = example === undefined ? '' : `\n  :example="'${example}'"`;
  return [
    `### \`${e.friendly}\``,
    '',
    `<ROperatorCard`,
    `  name="${e.friendly}"`,
    `  category="${category}"`,
    `  description="${e.behavior}"${exampleAttr}`,
    '/>',
    '',
    kindLine(e),
    '',
    ...renderStory(e),
    '',
  ];
};

const renderBoundaryPage = (group: DocsGroup): string => {
  const boundaries = catalog.filter((e) => e.kind === 'boundary');
  const lines = [
    '---',
    `title: "Operator Vocabulary: ${group.title}"`,
    'outline: deep',
    '---',
    '',
    `# ${group.title}`,
    '',
    group.intro,
    '',
    '| Boundary | Argument | Meaning |',
    '| --- | --- | --- |',
    '| `time(ms)` | fixed duration | a fixed clock duration drives the boundary |',
    '| `count(n)` | fixed count | a fixed number of values drives the boundary |',
    '| `whileTrue(p)` | predicate | continue as long as the predicate holds |',
    '| `until(signal$)` | notifier | terminal — the notifier ends it, fires once |',
    '| `on(signal$)` | notifier | repeating — act each time the notifier emits |',
    '| `when(make)` | factory | you create the boundary signal per cycle / per value |',
    '| `toggle(open$, close)` | signal pair | act between explicit open and close signals |',
    '',
    '## How construction works',
    '',
    'Each family root is a curried function over a boundary; the two-word names are named partial applications:',
    '',
    '```ts',
    "import { buffer, bufferOn, count, on, time } from 'rxjs-friendly';",
    '',
    'source$.pipe(buffer(count(5)));    // composed form',
    'source$.pipe(buffer(on(flush$)));  // composed form',
    'source$.pipe(bufferOn(flush$));    // applied form - same operator',
    '```',
    '',
    'Invalid combinations are compile errors: `debounce(count(3))` does not typecheck.',
    '',
    '## The boundary values',
    '',
    ...boundaries.flatMap((b) => [`- \`${b.friendly}\` — ${b.behavior}`]),
    '',
  ];
  return `${lines.join('\n')}\n`;
};

const renderExcludedPage = (): string => {
  const excluded = catalog.filter((e) => e.kind === 'excluded');
  const lines = [
    '---',
    'title: "Operator Vocabulary: Excluded Operators"',
    'outline: deep',
    '---',
    '',
    '# Excluded (Deprecated) Operators',
    '',
    'These operators are deprecated in RxJS 7/8 and are not part of the vocabulary. The vocabulary teaches the modern replacement instead.',
    '',
    '| Official (rxjs) | Replacement |',
    '| --- | --- |',
    ...excluded.map((e) => `| \`${e.official ?? e.friendly}\` | ${e.behavior} |`),
    '',
  ];
  return `${lines.join('\n')}\n`;
};

const renderGroupPage = (group: DocsGroup): string => {
  const entries = catalog
    .filter((e) => group.families.includes(e.family) && e.kind !== 'excluded' && e.kind !== 'boundary')
    .sort(
      (a, b) =>
        (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9) ||
        a.friendly.localeCompare(b.friendly),
    );
  const lines = [
    '---',
    `title: "Operator Vocabulary: ${group.title}"`,
    'outline: deep',
    '---',
    '',
    `# ${group.title}`,
    '',
    group.intro,
    '',
    ...entries.flatMap(renderEntry),
  ];
  return `${lines.join('\n')}\n`;
};

const renderIndexPage = (): string => {
  const renamedCount = catalog.filter(
    (e) => e.kind === 'alias' || e.kind === 'partial' || e.kind === 'wrapper',
  ).length;
  const keptCount = catalog.filter((e) => e.kind === 'keep').length;
  const excludedCount = catalog.filter((e) => e.kind === 'excluded').length;
  const lines = [
    '---',
    'title: "Operator Vocabulary: Overview"',
    'outline: deep',
    '---',
    '',
    '# Operator Vocabulary',
    '',
    'A user-friendly RxJS operator vocabulary built on one principle: **keep the root, fix the suffix**.',
    'The first word of every pipeable, flattening, and aggregate operator stays the official RxJS root;',
    'the second word comes from a closed suffix grammar where each suffix has exactly one meaning —',
    'so a name tells you both the behavior and the argument type.',
    '',
    `Coverage: ${renamedCount} renamed, ${keptCount} kept unchanged, ${excludedCount} deprecated operators excluded.`,
    '',
    '## The suffix grammar',
    '',
    '| Suffix | Argument | Meaning |',
    '| --- | --- | --- |',
    '| *(bare root + number)* | `n` | implicit count: `take(3)`, `skip(2)` |',
    '| `Time` | `ms` | a **fixed clock duration** drives the boundary |',
    '| `Count` | `n` | a **fixed number of values** drives the boundary |',
    '| `While` | `predicate` | continue **as long as** the predicate holds |',
    '| `Until` | `signal$` | a notifier ends it — **terminal, fires once** |',
    '| `On` | `signal$` | act **each time** the notifier emits — repeating trigger |',
    '| `When` | `factory → signal$` | **you create** the boundary signal per cycle / per value |',
    '| `Toggle` | `open$, close` | act **between** explicit open and close signals |',
    '| `With` | observables / values | join or extend the source with others |',
    '| `Map` | `project → inner$` | map each value to an inner observable, flattened by the **root strategy** |',
    '| `All` | — | flatten a higher-order observable by the **root strategy** |',
    '| `By` | `key selector` | compare / group by a key |',
    '| `OnComplete` | — | the result emits **only when the source completes** |',
    '',
    '## The four flattening strategies',
    '',
    '| Root | Concurrency policy |',
    '| --- | --- |',
    '| `concat` | queue in order — one inner at a time, new work waits |',
    '| `switch` | keep latest — new work cancels the previous inner |',
    '| `merge` | run concurrently — inners overlap |',
    '| `exhaust` | ignore while busy — new work is dropped until the inner completes |',
    '',
    '## Reading an operator page',
    '',
    'Every operator carries its **8-policy story** — Source → Trigger → Value → Cardinality →',
    'Time → Concurrency → Cancellation → Termination. The story is the precise behavior',
    'description; the card gives the one-sentence summary.',
    '',
    '## Sections',
    '',
    ...GROUPS.map((g) => `- [${g.title}](/vocabulary/${g.slug})`),
    '- [Excluded (Deprecated)](/vocabulary/excluded)',
    '',
  ];
  return `${lines.join('\n')}\n`;
};

export function renderDocsPages(): readonly DocsPage[] {
  return [
    { path: 'vocabulary/index.md', content: renderIndexPage() },
    ...GROUPS.map((g) => ({
      path: `vocabulary/${g.slug}.md`,
      content: g.slug === 'boundaries' ? renderBoundaryPage(g) : renderGroupPage(g),
    })),
    { path: 'vocabulary/excluded.md', content: renderExcludedPage() },
  ];
}

export function renderVocabularySidebar(): string {
  const sidebar = [
    {
      text: 'Operator Vocabulary',
      collapsed: true,
      items: [
        { text: 'Overview - Suffix Grammar', link: '/vocabulary/' },
        ...GROUPS.map((g) => ({ text: g.title, link: `/vocabulary/${g.slug}` })),
        { text: 'Excluded (Deprecated)', link: '/vocabulary/excluded' },
      ],
    },
  ];
  return `${JSON.stringify(sidebar, null, 2)}\n`;
}
