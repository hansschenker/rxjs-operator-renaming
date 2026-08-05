/**
 * Grammar-conform official names, re-exported for one-stop teaching imports.
 *
 * These already obey the suffix grammar (one suffix, one meaning) and keep
 * their official names. The bare roots `take`, `skip`, `buffer`, `window`,
 * `debounce`, `throttle`, `audit`, `sample` are intentionally NOT re-exported
 * here — the curried roots in `roots.ts` take their place.
 */
export {
  // take / skip siblings
  takeWhile,
  takeUntil,
  skipWhile,
  skipUntil,
  skipLast,
  // buffer / window siblings
  bufferTime,
  bufferCount,
  bufferToggle,
  bufferWhen,
  windowTime,
  windowCount,
  windowToggle,
  windowWhen,
  // timing siblings
  debounceTime,
  throttleTime,
  auditTime,
  sampleTime,
  delay,
  delayWhen,
  timeout,
  // filtering
  distinct,
  filter,
  first,
  last,
  single,
  find,
  findIndex,
  elementAt,
  // transformation
  map,
  scan,
  pairwise,
  groupBy,
  // flattening — the sacred strategy vocabulary
  concatMap,
  mergeMap,
  switchMap,
  exhaustMap,
  concatAll,
  mergeAll,
  switchAll,
  exhaustAll,
  mergeScan,
  switchScan,
  expand,
  // joining
  startWith,
  endWith,
  withLatestFrom,
  // error handling / utility / sharing
  catchError,
  retry,
  tap,
  finalize,
  share,
} from 'rxjs';
