import type { Observable, ObservableInput } from 'rxjs';

/**
 * Boundary combinators — the suffix grammar as first-class values.
 *
 * Each suffix of the vocabulary exists as a tagged value; the curried roots in
 * `roots.ts` dispatch on the tag to the official RxJS operator. One suffix,
 * one meaning:
 *
 * - `time(ms)`      — a fixed clock duration drives the boundary
 * - `count(n)`      — a fixed number of values drives the boundary
 * - `whileTrue(p)`  — continue as long as the predicate holds
 * - `until(s$)`     — a notifier ends it (terminal, fires once)
 * - `on(s$)`        — act each time the notifier emits (repeating trigger)
 * - `when(make)`    — you create the boundary signal per cycle / per value
 * - `toggle(o$, c)` — act between explicit open and close signals
 *
 * Note: bare `time` and `count` are reserved for boundaries inside this
 * vocabulary; the rxjs `count` aggregate is exported as `countOnComplete`.
 */

export interface TimeBoundary {
  readonly kind: 'time';
  readonly ms: number;
}

export interface CountBoundary {
  readonly kind: 'count';
  readonly n: number;
}

export interface WhileBoundary<T> {
  readonly kind: 'while';
  readonly predicate: (value: T, index: number) => boolean;
  readonly inclusive: boolean;
}

export interface UntilBoundary {
  readonly kind: 'until';
  readonly signal$: Observable<unknown>;
}

export interface OnBoundary {
  readonly kind: 'on';
  readonly signal$: Observable<unknown>;
}

export interface WhenBoundary<A> {
  readonly kind: 'when';
  readonly make: (value: A) => ObservableInput<unknown>;
}

export interface ToggleBoundary<O> {
  readonly kind: 'toggle';
  readonly open$: Observable<O>;
  readonly close: (openValue: O) => Observable<unknown>;
}

export const time = (ms: number): TimeBoundary => ({ kind: 'time', ms });

export const count = (n: number): CountBoundary => ({ kind: 'count', n });

export const whileTrue = <T>(
  predicate: (value: T, index: number) => boolean,
  inclusive = false,
): WhileBoundary<T> => ({ kind: 'while', predicate, inclusive });

export const until = (signal$: Observable<unknown>): UntilBoundary => ({
  kind: 'until',
  signal$,
});

export const on = (signal$: Observable<unknown>): OnBoundary => ({
  kind: 'on',
  signal$,
});

export const when = <A = void>(
  make: (value: A) => ObservableInput<unknown>,
): WhenBoundary<A> => ({ kind: 'when', make });

export const toggle = <O>(
  open$: Observable<O>,
  close: (openValue: O) => Observable<unknown>,
): ToggleBoundary<O> => ({ kind: 'toggle', open$, close });
