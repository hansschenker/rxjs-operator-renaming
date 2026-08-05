# Migration Tables

> Generated from `src/catalog.ts` by `npm run generate:migration` — do not edit by hand.

Summary: 17 renamed, 51 kept, 15 excluded.

## Official → vocabulary

| Official (rxjs) | Vocabulary | Kind | Notes |
| --- | --- | --- | --- |
| `audit` | `auditWhen` | partial | `audit(when(make))` — Suppresses while the signal you created runs, then emits the latest value. |
| `auditTime` | `auditTime` | keep | Official name already obeys the suffix grammar. |
| `buffer` | `bufferOn` | partial | `buffer(on(signal$))` — Flushes the collected array each time the signal emits. |
| `bufferCount` | `bufferCount` | keep | Official name already obeys the suffix grammar. |
| `bufferTime` | `bufferTime` | keep | Official name already obeys the suffix grammar. |
| `bufferToggle` | `bufferToggle` | keep | Official name already obeys the suffix grammar. |
| `bufferWhen` | `bufferWhen` | keep | Official name already obeys the suffix grammar. |
| `catchError` | `catchError` | keep | Official name already obeys the suffix grammar. |
| `concatAll` | `concatAll` | keep | Official name already obeys the suffix grammar. |
| `concatMap` | `concatMap` | keep | Official name already obeys the suffix grammar. |
| `concatMapTo` | — | excluded | Use concatMap(() => inner$). |
| `count` | `countOnComplete` | alias | Counts values; emits the total when the source completes. |
| `debounce` | `debounceWhen` | partial | `debounce(when(make))` — Emits a value once the signal you create for it fires without a newer value arriving. |
| `debounceTime` | `debounceTime` | keep | Official name already obeys the suffix grammar. |
| `delay` | `delay` | keep | Official name already obeys the suffix grammar. |
| `delayWhen` | `delayWhen` | keep | Official name already obeys the suffix grammar. |
| `distinct` | `distinct` | keep | Official name already obeys the suffix grammar. |
| `distinctUntilChanged` | `distinctFromPrevious` | alias | Drops only consecutive duplicates — compares with the previous value. |
| `distinctUntilKeyChanged` | `distinctFromPreviousBy` | alias | Drops consecutive duplicates compared by a selected key. |
| `elementAt` | `elementAt` | keep | Official name already obeys the suffix grammar. |
| `endWith` | `endWith` | keep | Official name already obeys the suffix grammar. |
| `exhaustAll` | `exhaustAll` | keep | Official name already obeys the suffix grammar. |
| `exhaustMap` | `exhaustMap` | keep | Official name already obeys the suffix grammar. |
| `expand` | `expand` | keep | Official name already obeys the suffix grammar. |
| `filter` | `filter` | keep | Official name already obeys the suffix grammar. |
| `finalize` | `finalize` | keep | Official name already obeys the suffix grammar. |
| `find` | `find` | keep | Official name already obeys the suffix grammar. |
| `findIndex` | `findIndex` | keep | Official name already obeys the suffix grammar. |
| `first` | `first` | keep | Official name already obeys the suffix grammar. |
| `forkJoin` | `whenAllReady` | alias | Waits for all inputs to complete, then emits their last values once. |
| `groupBy` | `groupBy` | keep | Official name already obeys the suffix grammar. |
| `ignoreElements` | `ignoreValues` | alias | Drops all values but keeps error and completion. |
| `last` | `last` | keep | Official name already obeys the suffix grammar. |
| `map` | `map` | keep | Official name already obeys the suffix grammar. |
| `mapTo` | — | excluded | Use map(() => value). |
| `max` | `maxOnComplete` | alias | Emits the largest value when the source completes. |
| `mergeAll` | `mergeAll` | keep | Official name already obeys the suffix grammar. |
| `mergeMap` | `mergeMap` | keep | Official name already obeys the suffix grammar. |
| `mergeMapTo` | — | excluded | Use mergeMap(() => inner$). |
| `mergeScan` | `mergeScan` | keep | Official name already obeys the suffix grammar. |
| `min` | `minOnComplete` | alias | Emits the smallest value when the source completes. |
| `multicast` | — | excluded | Use share with a connector. |
| `pairwise` | `pairwise` | keep | Official name already obeys the suffix grammar. |
| `pluck` | — | excluded | Use map with property access. |
| `publish` | — | excluded | Use share or connectable. |
| `publishBehavior` | — | excluded | Use share with a BehaviorSubject connector. |
| `publishLast` | — | excluded | Use share with an AsyncSubject connector. |
| `publishReplay` | — | excluded | Use share with a ReplaySubject connector, or shareReplay. |
| `reduce` | `reduceOnComplete` | alias | Folds all values; emits the single result when the source completes. |
| `refCount` | — | excluded | Use share({ resetOnRefCountZero }). |
| `repeatWhen` | — | excluded | Use repeat({ delay }). |
| `retry` | `retry` | keep | Official name already obeys the suffix grammar. |
| `retryWhen` | — | excluded | Use retry({ delay }). |
| `sample` | `sampleOn` | partial | `sample(on(signal$))` — Emits the latest source value each time the signal emits. |
| `sampleTime` | `sampleTime` | keep | Official name already obeys the suffix grammar. |
| `scan` | `scan` | keep | Official name already obeys the suffix grammar. |
| `share` | `share` | keep | Official name already obeys the suffix grammar. |
| `shareReplay` | `shareLatest` | wrapper | `shareReplay({ bufferSize: 1, refCount: true })` — Shares one subscription and replays the latest value to late subscribers. |
| `single` | `single` | keep | Official name already obeys the suffix grammar. |
| `skipLast` | `skipLast` | keep | Official name already obeys the suffix grammar. |
| `skipUntil` | `skipUntil` | keep | Official name already obeys the suffix grammar. |
| `skipWhile` | `skipWhile` | keep | Official name already obeys the suffix grammar. |
| `startWith` | `startWith` | keep | Official name already obeys the suffix grammar. |
| `switchAll` | `switchAll` | keep | Official name already obeys the suffix grammar. |
| `switchMap` | `switchMap` | keep | Official name already obeys the suffix grammar. |
| `switchMapTo` | — | excluded | Use switchMap(() => inner$). |
| `switchScan` | `switchScan` | keep | Official name already obeys the suffix grammar. |
| `takeLast` | `takeLastOnComplete` | alias | Buffers the last N values; emits them when the source completes. |
| `takeUntil` | `takeUntil` | keep | Official name already obeys the suffix grammar. |
| `takeWhile` | `takeWhile` | keep | Official name already obeys the suffix grammar. |
| `tap` | `tap` | keep | Official name already obeys the suffix grammar. |
| `throttle` | `throttleWhen` | partial | `throttle(when(make))` — Emits a value, then suppresses until the signal you created for it fires. |
| `throttleTime` | `throttleTime` | keep | Official name already obeys the suffix grammar. |
| `timeout` | `timeout` | keep | Official name already obeys the suffix grammar. |
| `timeoutWith` | — | excluded | Use timeout({ with }). |
| `toArray` | `toArrayOnComplete` | alias | Collects all values into one array; emits it when the source completes. |
| `toPromise` | — | excluded | Use firstValueFrom or lastValueFrom. |
| `window` | `windowOn` | partial | `window(on(signal$))` — Closes the current window and opens a new one each time the signal emits. |
| `windowCount` | `windowCount` | keep | Official name already obeys the suffix grammar. |
| `windowTime` | `windowTime` | keep | Official name already obeys the suffix grammar. |
| `windowToggle` | `windowToggle` | keep | Official name already obeys the suffix grammar. |
| `windowWhen` | `windowWhen` | keep | Official name already obeys the suffix grammar. |
| `withLatestFrom` | `withLatestFrom` | keep | Official name already obeys the suffix grammar. |

## Vocabulary → official

Boundaries and curried roots have no single official counterpart — the root
dispatches to a different official operator per boundary kind (see the README
suffix grammar).

| Vocabulary | Official (rxjs) | Kind | Notes |
| --- | --- | --- | --- |
| `audit` | — | root | Suppress during the window, emit the latest when it closes: time or when. |
| `auditTime` | `auditTime` | keep | Re-exported unchanged. |
| `auditWhen` | `audit` | partial | `audit(when(make))` — Suppresses while the signal you created runs, then emits the latest value. |
| `buffer` | — | root | Collect values into arrays; flush per boundary: time, count, on, when, toggle. |
| `bufferCount` | `bufferCount` | keep | Re-exported unchanged. |
| `bufferOn` | `buffer` | partial | `buffer(on(signal$))` — Flushes the collected array each time the signal emits. |
| `bufferTime` | `bufferTime` | keep | Re-exported unchanged. |
| `bufferToggle` | `bufferToggle` | keep | Re-exported unchanged. |
| `bufferWhen` | `bufferWhen` | keep | Re-exported unchanged. |
| `catchError` | `catchError` | keep | Re-exported unchanged. |
| `concatAll` | `concatAll` | keep | Re-exported unchanged. |
| `concatMap` | `concatMap` | keep | Re-exported unchanged. |
| `count` | — | boundary | A fixed number of values drives the boundary (reserved for boundaries; the rxjs aggregate is countOnComplete). |
| `countOnComplete` | `count` | alias | Counts values; emits the total when the source completes. |
| `debounce` | — | root | Emit the latest value after silence: time (fixed) or when (per-value signal). |
| `debounceTime` | `debounceTime` | keep | Re-exported unchanged. |
| `debounceWhen` | `debounce` | partial | `debounce(when(make))` — Emits a value once the signal you create for it fires without a newer value arriving. |
| `delay` | `delay` | keep | Re-exported unchanged. |
| `delayWhen` | `delayWhen` | keep | Re-exported unchanged. |
| `distinct` | `distinct` | keep | Re-exported unchanged. |
| `distinctFromPrevious` | `distinctUntilChanged` | alias | Drops only consecutive duplicates — compares with the previous value. |
| `distinctFromPreviousBy` | `distinctUntilKeyChanged` | alias | Drops consecutive duplicates compared by a selected key. |
| `elementAt` | `elementAt` | keep | Re-exported unchanged. |
| `endWith` | `endWith` | keep | Re-exported unchanged. |
| `exhaustAll` | `exhaustAll` | keep | Re-exported unchanged. |
| `exhaustMap` | `exhaustMap` | keep | Re-exported unchanged. |
| `expand` | `expand` | keep | Re-exported unchanged. |
| `filter` | `filter` | keep | Re-exported unchanged. |
| `finalize` | `finalize` | keep | Re-exported unchanged. |
| `find` | `find` | keep | Re-exported unchanged. |
| `findIndex` | `findIndex` | keep | Re-exported unchanged. |
| `first` | `first` | keep | Re-exported unchanged. |
| `groupBy` | `groupBy` | keep | Re-exported unchanged. |
| `ignoreValues` | `ignoreElements` | alias | Drops all values but keeps error and completion. |
| `last` | `last` | keep | Re-exported unchanged. |
| `map` | `map` | keep | Re-exported unchanged. |
| `maxOnComplete` | `max` | alias | Emits the largest value when the source completes. |
| `mergeAll` | `mergeAll` | keep | Re-exported unchanged. |
| `mergeMap` | `mergeMap` | keep | Re-exported unchanged. |
| `mergeScan` | `mergeScan` | keep | Re-exported unchanged. |
| `minOnComplete` | `min` | alias | Emits the smallest value when the source completes. |
| `on` | — | boundary | Act each time the notifier emits — repeating trigger. |
| `pairwise` | `pairwise` | keep | Re-exported unchanged. |
| `reduceOnComplete` | `reduce` | alias | Folds all values; emits the single result when the source completes. |
| `retry` | `retry` | keep | Re-exported unchanged. |
| `sample` | — | root | Emit the latest value on a trigger: time (interval) or on (signal). |
| `sampleOn` | `sample` | partial | `sample(on(signal$))` — Emits the latest source value each time the signal emits. |
| `sampleTime` | `sampleTime` | keep | Re-exported unchanged. |
| `scan` | `scan` | keep | Re-exported unchanged. |
| `share` | `share` | keep | Re-exported unchanged. |
| `shareLatest` | `shareReplay` | wrapper | `shareReplay({ bufferSize: 1, refCount: true })` — Shares one subscription and replays the latest value to late subscribers. |
| `single` | `single` | keep | Re-exported unchanged. |
| `skip` | — | root | Drop values while the boundary holds: count, whileTrue, until, time. |
| `skipLast` | `skipLast` | keep | Re-exported unchanged. |
| `skipUntil` | `skipUntil` | keep | Re-exported unchanged. |
| `skipWhile` | `skipWhile` | keep | Re-exported unchanged. |
| `startWith` | `startWith` | keep | Re-exported unchanged. |
| `switchAll` | `switchAll` | keep | Re-exported unchanged. |
| `switchMap` | `switchMap` | keep | Re-exported unchanged. |
| `switchScan` | `switchScan` | keep | Re-exported unchanged. |
| `take` | — | root | Keep values as long as the boundary allows: count, whileTrue, until, time. |
| `takeLastOnComplete` | `takeLast` | alias | Buffers the last N values; emits them when the source completes. |
| `takeUntil` | `takeUntil` | keep | Re-exported unchanged. |
| `takeWhile` | `takeWhile` | keep | Re-exported unchanged. |
| `tap` | `tap` | keep | Re-exported unchanged. |
| `throttle` | — | root | Emit, then suppress during the window: time (fixed) or when (per-value signal). |
| `throttleTime` | `throttleTime` | keep | Re-exported unchanged. |
| `throttleWhen` | `throttle` | partial | `throttle(when(make))` — Emits a value, then suppresses until the signal you created for it fires. |
| `time` | — | boundary | A fixed clock duration drives the boundary. |
| `timeout` | `timeout` | keep | Re-exported unchanged. |
| `toArrayOnComplete` | `toArray` | alias | Collects all values into one array; emits it when the source completes. |
| `toggle` | — | boundary | Act between explicit open and close signals. |
| `until` | — | boundary | A notifier observable ends it — terminal, fires once. |
| `when` | — | boundary | A factory you supply creates the boundary signal per cycle or per value. |
| `whenAllReady` | `forkJoin` | alias | Waits for all inputs to complete, then emits their last values once. |
| `whileTrue` | — | boundary | Continue as long as the predicate holds. |
| `window` | — | root | Route values into inner observables; open and close per boundary: time, count, on, when, toggle. |
| `windowCount` | `windowCount` | keep | Re-exported unchanged. |
| `windowOn` | `window` | partial | `window(on(signal$))` — Closes the current window and opens a new one each time the signal emits. |
| `windowTime` | `windowTime` | keep | Re-exported unchanged. |
| `windowToggle` | `windowToggle` | keep | Re-exported unchanged. |
| `windowWhen` | `windowWhen` | keep | Re-exported unchanged. |
| `withLatestFrom` | `withLatestFrom` | keep | Re-exported unchanged. |
