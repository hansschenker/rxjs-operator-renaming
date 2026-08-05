import type {
  MonoTypeOperatorFunction,
  Observable,
  ObservableInput,
  OperatorFunction,
} from 'rxjs';
import { on, when } from './boundaries';
import { audit, buffer, debounce, sample, throttle, window } from './roots';

/**
 * Renamed aliases — pure re-exports preserving the official signatures with
 * zero runtime cost. Aggregates gain `OnComplete` to declare their completion
 * dependency; the fake-`Until` names get honest replacements.
 */
export {
  distinctUntilChanged as distinctFromPrevious,
  distinctUntilKeyChanged as distinctFromPreviousBy,
  ignoreElements as ignoreValues,
  reduce as reduceOnComplete,
  count as countOnComplete,
  max as maxOnComplete,
  min as minOnComplete,
  toArray as toArrayOnComplete,
  takeLast as takeLastOnComplete,
  forkJoin as whenAllReady,
} from 'rxjs';

/**
 * Named partial applications of the curried roots — the two-word vocabulary.
 * Each has an equivalent composed spelling, e.g. `bufferOn(s$)` ≡
 * `buffer(on(s$))`.
 */

export const bufferOn = <T>(signal$: Observable<unknown>): OperatorFunction<T, T[]> =>
  buffer<T>(on(signal$));

export const windowOn = <T>(signal$: Observable<unknown>): OperatorFunction<T, Observable<T>> =>
  window<T>(on(signal$));

export const sampleOn = <T>(signal$: Observable<unknown>): MonoTypeOperatorFunction<T> =>
  sample<T>(on(signal$));

export const debounceWhen = <T>(
  durationSelector: (value: T) => ObservableInput<unknown>,
): MonoTypeOperatorFunction<T> => debounce<T>(when(durationSelector));

export const throttleWhen = <T>(
  durationSelector: (value: T) => ObservableInput<unknown>,
): MonoTypeOperatorFunction<T> => throttle<T>(when(durationSelector));

export const auditWhen = <T>(
  durationSelector: (value: T) => ObservableInput<unknown>,
): MonoTypeOperatorFunction<T> => audit<T>(when(durationSelector));
