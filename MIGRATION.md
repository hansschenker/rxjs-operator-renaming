# Migration Tables

> Generated from `src/catalog.ts` by `npm run generate:migration` — do not edit by hand.

Summary: 17 renamed, 51 kept, 15 excluded.

## Official → vocabulary

| Official (rxjs) | Vocabulary | Kind | Notes |
| --- | --- | --- | --- |
| `audit` | `auditWhen` | partial | `audit(when(make))` — Suppresses while the signal you created runs, then emits the latest value. |
| `auditTime` | `auditTime` | keep | Suppresses for a fixed window, then emits the latest value. |
| `buffer` | `bufferOn` | partial | `buffer(on(signal$))` — Flushes the collected array each time the signal emits. |
| `bufferCount` | `bufferCount` | keep | Collects values into arrays of N. |
| `bufferTime` | `bufferTime` | keep | Collects values into arrays over fixed durations. |
| `bufferToggle` | `bufferToggle` | keep | Collects values between open and close signals. |
| `bufferWhen` | `bufferWhen` | keep | Collects values until a created closing signal fires. |
| `catchError` | `catchError` | keep | Replaces a failed stream with a recovery observable. |
| `concatAll` | `concatAll` | keep | Flattens inner observables sequentially. |
| `concatMap` | `concatMap` | keep | Maps to inner observables and runs them one after another (queue). |
| `concatMapTo` | — | excluded | Use concatMap(() => inner$). |
| `count` | `countOnComplete` | alias | Counts values; emits the total when the source completes. |
| `debounce` | `debounceWhen` | partial | `debounce(when(make))` — Emits a value once the signal you create for it fires without a newer value arriving. |
| `debounceTime` | `debounceTime` | keep | Emits the latest value after a fixed silence. |
| `delay` | `delay` | keep | Shifts every value later by a fixed duration. |
| `delayWhen` | `delayWhen` | keep | Delays each value until its own signal fires. |
| `distinct` | `distinct` | keep | Emits only values never seen before in the whole stream. |
| `distinctUntilChanged` | `distinctFromPrevious` | alias | Drops only consecutive duplicates — compares with the previous value. |
| `distinctUntilKeyChanged` | `distinctFromPreviousBy` | alias | Drops consecutive duplicates compared by a selected key. |
| `elementAt` | `elementAt` | keep | Emits the value at the given index. |
| `endWith` | `endWith` | keep | Appends final values on completion. |
| `exhaustAll` | `exhaustAll` | keep | Flattens the first inner observable, ignoring others while busy. |
| `exhaustMap` | `exhaustMap` | keep | Maps to inner observables, ignoring new values while busy. |
| `expand` | `expand` | keep | Recursively feeds produced values back into the projection. |
| `filter` | `filter` | keep | Lets only matching values through. |
| `finalize` | `finalize` | keep | Runs a callback on completion, error, or unsubscribe. |
| `find` | `find` | keep | Emits the first value satisfying the predicate. |
| `findIndex` | `findIndex` | keep | Emits the index of the first match. |
| `first` | `first` | keep | Emits the first (matching) value, then completes. |
| `forkJoin` | `whenAllReady` | alias | Waits for all inputs to complete, then emits their last values once. |
| `groupBy` | `groupBy` | keep | Splits the stream into keyed substreams. |
| `ignoreElements` | `ignoreValues` | alias | Drops all values but keeps error and completion. |
| `last` | `last` | keep | Emits the final (matching) value on completion. |
| `map` | `map` | keep | Transforms each value. |
| `mapTo` | — | excluded | Use map(() => value). |
| `max` | `maxOnComplete` | alias | Emits the largest value when the source completes. |
| `mergeAll` | `mergeAll` | keep | Flattens inner observables concurrently. |
| `mergeMap` | `mergeMap` | keep | Maps to inner observables and runs them concurrently. |
| `mergeMapTo` | — | excluded | Use mergeMap(() => inner$). |
| `mergeScan` | `mergeScan` | keep | Accumulates state through overlapping async updates. |
| `min` | `minOnComplete` | alias | Emits the smallest value when the source completes. |
| `multicast` | — | excluded | Use share with a connector. |
| `pairwise` | `pairwise` | keep | Emits [previous, current] pairs. |
| `pluck` | — | excluded | Use map with property access. |
| `publish` | — | excluded | Use share or connectable. |
| `publishBehavior` | — | excluded | Use share with a BehaviorSubject connector. |
| `publishLast` | — | excluded | Use share with an AsyncSubject connector. |
| `publishReplay` | — | excluded | Use share with a ReplaySubject connector, or shareReplay. |
| `reduce` | `reduceOnComplete` | alias | Folds all values; emits the single result when the source completes. |
| `refCount` | — | excluded | Use share({ resetOnRefCountZero }). |
| `repeatWhen` | — | excluded | Use repeat({ delay }). |
| `retry` | `retry` | keep | Resubscribes after errors per the retry policy. |
| `retryWhen` | — | excluded | Use retry({ delay }). |
| `sample` | `sampleOn` | partial | `sample(on(signal$))` — Emits the latest source value each time the signal emits. |
| `sampleTime` | `sampleTime` | keep | Periodically emits the latest value. |
| `scan` | `scan` | keep | Emits the running accumulator state for every value. |
| `share` | `share` | keep | Shares one subscription among all subscribers. |
| `shareReplay` | `shareLatest` | wrapper | `shareReplay({ bufferSize: 1, refCount: true })` — Shares one subscription and replays the latest value to late subscribers. |
| `single` | `single` | keep | Requires exactly one matching value, errors otherwise. |
| `skipLast` | `skipLast` | keep | Forwards all but the final N values. |
| `skipUntil` | `skipUntil` | keep | Drops values until the notifier emits, then forwards. |
| `skipWhile` | `skipWhile` | keep | Drops values while the predicate holds, then forwards everything. |
| `startWith` | `startWith` | keep | Prepends initial values. |
| `switchAll` | `switchAll` | keep | Flattens by always switching to the latest inner observable. |
| `switchMap` | `switchMap` | keep | Maps to inner observables, cancelling the previous one (keep latest). |
| `switchMapTo` | — | excluded | Use switchMap(() => inner$). |
| `switchScan` | `switchScan` | keep | Accumulates state; only the latest async update survives. |
| `takeLast` | `takeLastOnComplete` | alias | Buffers the last N values; emits them when the source completes. |
| `takeUntil` | `takeUntil` | keep | Forwards values until the notifier emits, then completes. |
| `takeWhile` | `takeWhile` | keep | Keeps values while the predicate holds, then completes. |
| `tap` | `tap` | keep | Runs side effects without changing the stream. |
| `throttle` | `throttleWhen` | partial | `throttle(when(make))` — Emits a value, then suppresses until the signal you created for it fires. |
| `throttleTime` | `throttleTime` | keep | Emits a value, then suppresses for a fixed duration. |
| `timeout` | `timeout` | keep | Errors (or falls back) if the source is too slow. |
| `timeoutWith` | — | excluded | Use timeout({ with }). |
| `toArray` | `toArrayOnComplete` | alias | Collects all values into one array; emits it when the source completes. |
| `toPromise` | — | excluded | Use firstValueFrom or lastValueFrom. |
| `window` | `windowOn` | partial | `window(on(signal$))` — Closes the current window and opens a new one each time the signal emits. |
| `windowCount` | `windowCount` | keep | Routes values into inner observable windows of N. |
| `windowTime` | `windowTime` | keep | Routes values into inner observable windows over fixed durations. |
| `windowToggle` | `windowToggle` | keep | Opens windows between open and close signals. |
| `windowWhen` | `windowWhen` | keep | Opens a window until a created closing signal fires, then the next. |
| `withLatestFrom` | `withLatestFrom` | keep | Pairs each primary value with the latest values of other streams. |

## Vocabulary → official

Boundaries and curried roots have no single official counterpart — the root
dispatches to a different official operator per boundary kind (see the README
suffix grammar).

| Vocabulary | Official (rxjs) | Kind | Notes |
| --- | --- | --- | --- |
| `audit` | — | root | Suppress during the window, emit the latest when it closes: time or when. |
| `auditTime` | `auditTime` | keep | Suppresses for a fixed window, then emits the latest value. |
| `auditWhen` | `audit` | partial | `audit(when(make))` — Suppresses while the signal you created runs, then emits the latest value. |
| `buffer` | — | root | Collect values into arrays; flush per boundary: time, count, on, when, toggle. |
| `bufferCount` | `bufferCount` | keep | Collects values into arrays of N. |
| `bufferOn` | `buffer` | partial | `buffer(on(signal$))` — Flushes the collected array each time the signal emits. |
| `bufferTime` | `bufferTime` | keep | Collects values into arrays over fixed durations. |
| `bufferToggle` | `bufferToggle` | keep | Collects values between open and close signals. |
| `bufferWhen` | `bufferWhen` | keep | Collects values until a created closing signal fires. |
| `catchError` | `catchError` | keep | Replaces a failed stream with a recovery observable. |
| `concatAll` | `concatAll` | keep | Flattens inner observables sequentially. |
| `concatMap` | `concatMap` | keep | Maps to inner observables and runs them one after another (queue). |
| `count` | — | boundary | A fixed number of values drives the boundary (reserved for boundaries; the rxjs aggregate is countOnComplete). |
| `countOnComplete` | `count` | alias | Counts values; emits the total when the source completes. |
| `debounce` | — | root | Emit the latest value after silence: time (fixed) or when (per-value signal). |
| `debounceTime` | `debounceTime` | keep | Emits the latest value after a fixed silence. |
| `debounceWhen` | `debounce` | partial | `debounce(when(make))` — Emits a value once the signal you create for it fires without a newer value arriving. |
| `delay` | `delay` | keep | Shifts every value later by a fixed duration. |
| `delayWhen` | `delayWhen` | keep | Delays each value until its own signal fires. |
| `distinct` | `distinct` | keep | Emits only values never seen before in the whole stream. |
| `distinctFromPrevious` | `distinctUntilChanged` | alias | Drops only consecutive duplicates — compares with the previous value. |
| `distinctFromPreviousBy` | `distinctUntilKeyChanged` | alias | Drops consecutive duplicates compared by a selected key. |
| `elementAt` | `elementAt` | keep | Emits the value at the given index. |
| `endWith` | `endWith` | keep | Appends final values on completion. |
| `exhaustAll` | `exhaustAll` | keep | Flattens the first inner observable, ignoring others while busy. |
| `exhaustMap` | `exhaustMap` | keep | Maps to inner observables, ignoring new values while busy. |
| `expand` | `expand` | keep | Recursively feeds produced values back into the projection. |
| `filter` | `filter` | keep | Lets only matching values through. |
| `finalize` | `finalize` | keep | Runs a callback on completion, error, or unsubscribe. |
| `find` | `find` | keep | Emits the first value satisfying the predicate. |
| `findIndex` | `findIndex` | keep | Emits the index of the first match. |
| `first` | `first` | keep | Emits the first (matching) value, then completes. |
| `groupBy` | `groupBy` | keep | Splits the stream into keyed substreams. |
| `ignoreValues` | `ignoreElements` | alias | Drops all values but keeps error and completion. |
| `last` | `last` | keep | Emits the final (matching) value on completion. |
| `map` | `map` | keep | Transforms each value. |
| `maxOnComplete` | `max` | alias | Emits the largest value when the source completes. |
| `mergeAll` | `mergeAll` | keep | Flattens inner observables concurrently. |
| `mergeMap` | `mergeMap` | keep | Maps to inner observables and runs them concurrently. |
| `mergeScan` | `mergeScan` | keep | Accumulates state through overlapping async updates. |
| `minOnComplete` | `min` | alias | Emits the smallest value when the source completes. |
| `on` | — | boundary | Act each time the notifier emits — repeating trigger. |
| `pairwise` | `pairwise` | keep | Emits [previous, current] pairs. |
| `reduceOnComplete` | `reduce` | alias | Folds all values; emits the single result when the source completes. |
| `retry` | `retry` | keep | Resubscribes after errors per the retry policy. |
| `sample` | — | root | Emit the latest value on a trigger: time (interval) or on (signal). |
| `sampleOn` | `sample` | partial | `sample(on(signal$))` — Emits the latest source value each time the signal emits. |
| `sampleTime` | `sampleTime` | keep | Periodically emits the latest value. |
| `scan` | `scan` | keep | Emits the running accumulator state for every value. |
| `share` | `share` | keep | Shares one subscription among all subscribers. |
| `shareLatest` | `shareReplay` | wrapper | `shareReplay({ bufferSize: 1, refCount: true })` — Shares one subscription and replays the latest value to late subscribers. |
| `single` | `single` | keep | Requires exactly one matching value, errors otherwise. |
| `skip` | — | root | Drop values while the boundary holds: count, whileTrue, until, time. |
| `skipLast` | `skipLast` | keep | Forwards all but the final N values. |
| `skipUntil` | `skipUntil` | keep | Drops values until the notifier emits, then forwards. |
| `skipWhile` | `skipWhile` | keep | Drops values while the predicate holds, then forwards everything. |
| `startWith` | `startWith` | keep | Prepends initial values. |
| `switchAll` | `switchAll` | keep | Flattens by always switching to the latest inner observable. |
| `switchMap` | `switchMap` | keep | Maps to inner observables, cancelling the previous one (keep latest). |
| `switchScan` | `switchScan` | keep | Accumulates state; only the latest async update survives. |
| `take` | — | root | Keep values as long as the boundary allows: count, whileTrue, until, time. |
| `takeLastOnComplete` | `takeLast` | alias | Buffers the last N values; emits them when the source completes. |
| `takeUntil` | `takeUntil` | keep | Forwards values until the notifier emits, then completes. |
| `takeWhile` | `takeWhile` | keep | Keeps values while the predicate holds, then completes. |
| `tap` | `tap` | keep | Runs side effects without changing the stream. |
| `throttle` | — | root | Emit, then suppress during the window: time (fixed) or when (per-value signal). |
| `throttleTime` | `throttleTime` | keep | Emits a value, then suppresses for a fixed duration. |
| `throttleWhen` | `throttle` | partial | `throttle(when(make))` — Emits a value, then suppresses until the signal you created for it fires. |
| `time` | — | boundary | A fixed clock duration drives the boundary. |
| `timeout` | `timeout` | keep | Errors (or falls back) if the source is too slow. |
| `toArrayOnComplete` | `toArray` | alias | Collects all values into one array; emits it when the source completes. |
| `toggle` | — | boundary | Act between explicit open and close signals. |
| `until` | — | boundary | A notifier observable ends it — terminal, fires once. |
| `when` | — | boundary | A factory you supply creates the boundary signal per cycle or per value. |
| `whenAllReady` | `forkJoin` | alias | Waits for all inputs to complete, then emits their last values once. |
| `whileTrue` | — | boundary | Continue as long as the predicate holds. |
| `window` | — | root | Route values into inner observables; open and close per boundary: time, count, on, when, toggle. |
| `windowCount` | `windowCount` | keep | Routes values into inner observable windows of N. |
| `windowOn` | `window` | partial | `window(on(signal$))` — Closes the current window and opens a new one each time the signal emits. |
| `windowTime` | `windowTime` | keep | Routes values into inner observable windows over fixed durations. |
| `windowToggle` | `windowToggle` | keep | Opens windows between open and close signals. |
| `windowWhen` | `windowWhen` | keep | Opens a window until a created closing signal fires, then the next. |
| `withLatestFrom` | `withLatestFrom` | keep | Pairs each primary value with the latest values of other streams. |
