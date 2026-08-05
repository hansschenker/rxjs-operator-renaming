/**
 * Single source of truth for the vocabulary — the operator modules, the tests,
 * the migration tables, and docs pages derive from this array so they can
 * never drift.
 */

export type EntryKind = 'boundary' | 'root' | 'alias' | 'partial' | 'wrapper' | 'excluded';

export interface CatalogEntry {
  /** Exported vocabulary name (for excluded entries: the official name). */
  readonly friendly: string;
  /** Official rxjs export this maps to; null for boundaries and roots. */
  readonly official: string | null;
  readonly family: string;
  readonly kind: EntryKind;
  /** Composed spelling, when the name is a named partial application. */
  readonly composed?: string;
  /** One-line behavior statement (for excluded entries: the replacement). */
  readonly behavior: string;
}

export const catalog: readonly CatalogEntry[] = [
  // Boundary combinators — the suffixes as values
  { friendly: 'time', official: null, family: 'boundary', kind: 'boundary', behavior: 'A fixed clock duration drives the boundary.' },
  { friendly: 'count', official: null, family: 'boundary', kind: 'boundary', behavior: 'A fixed number of values drives the boundary (reserved for boundaries; the rxjs aggregate is countOnComplete).' },
  { friendly: 'whileTrue', official: null, family: 'boundary', kind: 'boundary', behavior: 'Continue as long as the predicate holds.' },
  { friendly: 'until', official: null, family: 'boundary', kind: 'boundary', behavior: 'A notifier observable ends it — terminal, fires once.' },
  { friendly: 'on', official: null, family: 'boundary', kind: 'boundary', behavior: 'Act each time the notifier emits — repeating trigger.' },
  { friendly: 'when', official: null, family: 'boundary', kind: 'boundary', behavior: 'A factory you supply creates the boundary signal per cycle or per value.' },
  { friendly: 'toggle', official: null, family: 'boundary', kind: 'boundary', behavior: 'Act between explicit open and close signals.' },

  // Curried roots — dispatch on the boundary kind to the official operator
  { friendly: 'take', official: null, family: 'take', kind: 'root', behavior: 'Keep values as long as the boundary allows: count, whileTrue, until, time.' },
  { friendly: 'skip', official: null, family: 'skip', kind: 'root', behavior: 'Drop values while the boundary holds: count, whileTrue, until, time.' },
  { friendly: 'buffer', official: null, family: 'buffer', kind: 'root', behavior: 'Collect values into arrays; flush per boundary: time, count, on, when, toggle.' },
  { friendly: 'window', official: null, family: 'window', kind: 'root', behavior: 'Route values into inner observables; open and close per boundary: time, count, on, when, toggle.' },
  { friendly: 'debounce', official: null, family: 'debounce', kind: 'root', behavior: 'Emit the latest value after silence: time (fixed) or when (per-value signal).' },
  { friendly: 'throttle', official: null, family: 'throttle', kind: 'root', behavior: 'Emit, then suppress during the window: time (fixed) or when (per-value signal).' },
  { friendly: 'audit', official: null, family: 'audit', kind: 'root', behavior: 'Suppress during the window, emit the latest when it closes: time or when.' },
  { friendly: 'sample', official: null, family: 'sample', kind: 'root', behavior: 'Emit the latest value on a trigger: time (interval) or on (signal).' },

  // Named partial applications — the two-word vocabulary
  { friendly: 'bufferOn', official: 'buffer', family: 'buffer', kind: 'partial', composed: 'buffer(on(signal$))', behavior: 'Flushes the collected array each time the signal emits.' },
  { friendly: 'windowOn', official: 'window', family: 'window', kind: 'partial', composed: 'window(on(signal$))', behavior: 'Closes the current window and opens a new one each time the signal emits.' },
  { friendly: 'sampleOn', official: 'sample', family: 'sample', kind: 'partial', composed: 'sample(on(signal$))', behavior: 'Emits the latest source value each time the signal emits.' },
  { friendly: 'debounceWhen', official: 'debounce', family: 'debounce', kind: 'partial', composed: 'debounce(when(make))', behavior: 'Emits a value once the signal you create for it fires without a newer value arriving.' },
  { friendly: 'throttleWhen', official: 'throttle', family: 'throttle', kind: 'partial', composed: 'throttle(when(make))', behavior: 'Emits a value, then suppresses until the signal you created for it fires.' },
  { friendly: 'auditWhen', official: 'audit', family: 'audit', kind: 'partial', composed: 'audit(when(make))', behavior: 'Suppresses while the signal you created runs, then emits the latest value.' },

  // Renamed aliases — pure re-exports
  { friendly: 'distinctFromPrevious', official: 'distinctUntilChanged', family: 'distinct', kind: 'alias', behavior: 'Drops only consecutive duplicates — compares with the previous value.' },
  { friendly: 'distinctFromPreviousBy', official: 'distinctUntilKeyChanged', family: 'distinct', kind: 'alias', behavior: 'Drops consecutive duplicates compared by a selected key.' },
  { friendly: 'ignoreValues', official: 'ignoreElements', family: 'filter', kind: 'alias', behavior: 'Drops all values but keeps error and completion.' },
  { friendly: 'reduceOnComplete', official: 'reduce', family: 'aggregate', kind: 'alias', behavior: 'Folds all values; emits the single result when the source completes.' },
  { friendly: 'countOnComplete', official: 'count', family: 'aggregate', kind: 'alias', behavior: 'Counts values; emits the total when the source completes.' },
  { friendly: 'maxOnComplete', official: 'max', family: 'aggregate', kind: 'alias', behavior: 'Emits the largest value when the source completes.' },
  { friendly: 'minOnComplete', official: 'min', family: 'aggregate', kind: 'alias', behavior: 'Emits the smallest value when the source completes.' },
  { friendly: 'toArrayOnComplete', official: 'toArray', family: 'aggregate', kind: 'alias', behavior: 'Collects all values into one array; emits it when the source completes.' },
  { friendly: 'takeLastOnComplete', official: 'takeLast', family: 'take', kind: 'alias', behavior: 'Buffers the last N values; emits them when the source completes.' },
  { friendly: 'whenAllReady', official: 'forkJoin', family: 'join', kind: 'alias', behavior: 'Waits for all inputs to complete, then emits their last values once.' },

  // Configured wrappers
  { friendly: 'shareLatest', official: 'shareReplay', family: 'share', kind: 'wrapper', composed: 'shareReplay({ bufferSize: 1, refCount: true })', behavior: 'Shares one subscription and replays the latest value to late subscribers.' },

  // Excluded — deprecated in RxJS 7/8; the vocabulary teaches the replacement
  { friendly: 'retryWhen', official: 'retryWhen', family: 'error', kind: 'excluded', behavior: 'Use retry({ delay }).' },
  { friendly: 'repeatWhen', official: 'repeatWhen', family: 'repeat', kind: 'excluded', behavior: 'Use repeat({ delay }).' },
  { friendly: 'timeoutWith', official: 'timeoutWith', family: 'timing', kind: 'excluded', behavior: 'Use timeout({ with }).' },
  { friendly: 'mapTo', official: 'mapTo', family: 'transform', kind: 'excluded', behavior: 'Use map(() => value).' },
  { friendly: 'pluck', official: 'pluck', family: 'transform', kind: 'excluded', behavior: 'Use map with property access.' },
  { friendly: 'concatMapTo', official: 'concatMapTo', family: 'flatten', kind: 'excluded', behavior: 'Use concatMap(() => inner$).' },
  { friendly: 'mergeMapTo', official: 'mergeMapTo', family: 'flatten', kind: 'excluded', behavior: 'Use mergeMap(() => inner$).' },
  { friendly: 'switchMapTo', official: 'switchMapTo', family: 'flatten', kind: 'excluded', behavior: 'Use switchMap(() => inner$).' },
  { friendly: 'publish', official: 'publish', family: 'share', kind: 'excluded', behavior: 'Use share or connectable.' },
  { friendly: 'publishBehavior', official: 'publishBehavior', family: 'share', kind: 'excluded', behavior: 'Use share with a BehaviorSubject connector.' },
  { friendly: 'publishLast', official: 'publishLast', family: 'share', kind: 'excluded', behavior: 'Use share with an AsyncSubject connector.' },
  { friendly: 'publishReplay', official: 'publishReplay', family: 'share', kind: 'excluded', behavior: 'Use share with a ReplaySubject connector, or shareReplay.' },
  { friendly: 'multicast', official: 'multicast', family: 'share', kind: 'excluded', behavior: 'Use share with a connector.' },
  { friendly: 'refCount', official: 'refCount', family: 'share', kind: 'excluded', behavior: 'Use share({ resetOnRefCountZero }).' },
  { friendly: 'toPromise', official: 'toPromise', family: 'interop', kind: 'excluded', behavior: 'Use firstValueFrom or lastValueFrom.' },
];

/** Official names kept as-is and re-exported by `kept.ts` (grammar-conform). */
export const keptOfficialNames: readonly string[] = [
  'takeWhile',
  'takeUntil',
  'skipWhile',
  'skipUntil',
  'skipLast',
  'bufferTime',
  'bufferCount',
  'bufferToggle',
  'bufferWhen',
  'windowTime',
  'windowCount',
  'windowToggle',
  'windowWhen',
  'debounceTime',
  'throttleTime',
  'auditTime',
  'sampleTime',
  'delay',
  'delayWhen',
  'timeout',
  'distinct',
  'filter',
  'first',
  'last',
  'single',
  'find',
  'findIndex',
  'elementAt',
  'map',
  'scan',
  'pairwise',
  'groupBy',
  'concatMap',
  'mergeMap',
  'switchMap',
  'exhaustMap',
  'concatAll',
  'mergeAll',
  'switchAll',
  'exhaustAll',
  'mergeScan',
  'switchScan',
  'expand',
  'startWith',
  'endWith',
  'withLatestFrom',
  'catchError',
  'retry',
  'tap',
  'finalize',
  'share',
];
