import {
  audit as rxAudit,
  auditTime as rxAuditTime,
  buffer as rxBuffer,
  bufferCount as rxBufferCount,
  bufferTime as rxBufferTime,
  bufferToggle as rxBufferToggle,
  bufferWhen as rxBufferWhen,
  debounce as rxDebounce,
  debounceTime as rxDebounceTime,
  sample as rxSample,
  sampleTime as rxSampleTime,
  skip as rxSkip,
  skipUntil as rxSkipUntil,
  skipWhile as rxSkipWhile,
  take as rxTake,
  takeUntil as rxTakeUntil,
  takeWhile as rxTakeWhile,
  throttle as rxThrottle,
  throttleTime as rxThrottleTime,
  timer,
  window as rxWindow,
  windowCount as rxWindowCount,
  windowTime as rxWindowTime,
  windowToggle as rxWindowToggle,
  windowWhen as rxWindowWhen,
} from 'rxjs';
import type { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import type {
  CountBoundary,
  OnBoundary,
  TimeBoundary,
  ToggleBoundary,
  UntilBoundary,
  WhenBoundary,
  WhileBoundary,
} from './boundaries';

/**
 * Curried family roots — each root takes a boundary and dispatches to the
 * exact official RxJS operator. The FP layer is construction sugar only;
 * runtime semantics are always the official implementation.
 *
 * `time` on `take`/`skip` is a generated operator RxJS never shipped:
 * `take(time(ms))` = `takeUntil(timer(ms))`.
 */

export type TakeBoundary<T> = CountBoundary | WhileBoundary<T> | UntilBoundary | TimeBoundary;

export function take<T>(boundary: TakeBoundary<T>): MonoTypeOperatorFunction<T> {
  switch (boundary.kind) {
    case 'count':
      return rxTake(boundary.n);
    case 'while':
      return rxTakeWhile(boundary.predicate, boundary.inclusive);
    case 'until':
      return rxTakeUntil(boundary.signal$);
    case 'time':
      return rxTakeUntil(timer(boundary.ms));
  }
}

export type SkipBoundary<T> = CountBoundary | WhileBoundary<T> | UntilBoundary | TimeBoundary;

export function skip<T>(boundary: SkipBoundary<T>): MonoTypeOperatorFunction<T> {
  switch (boundary.kind) {
    case 'count':
      return rxSkip(boundary.n);
    case 'while':
      return rxSkipWhile(boundary.predicate);
    case 'until':
      return rxSkipUntil(boundary.signal$);
    case 'time':
      return rxSkipUntil(timer(boundary.ms));
  }
}

export type BufferBoundary<O = unknown> =
  | TimeBoundary
  | CountBoundary
  | OnBoundary
  | WhenBoundary<void>
  | ToggleBoundary<O>;

export function buffer<T>(
  boundary: TimeBoundary | CountBoundary | OnBoundary | WhenBoundary<void>,
): OperatorFunction<T, T[]>;
export function buffer<T, O>(boundary: ToggleBoundary<O>): OperatorFunction<T, T[]>;
export function buffer<T, O>(boundary: BufferBoundary<O>): OperatorFunction<T, T[]> {
  switch (boundary.kind) {
    case 'time':
      return rxBufferTime<T>(boundary.ms);
    case 'count':
      return rxBufferCount<T>(boundary.n);
    case 'on':
      return rxBuffer<T>(boundary.signal$);
    case 'when':
      return rxBufferWhen<T>(() => boundary.make(undefined));
    case 'toggle':
      return rxBufferToggle<T, O>(boundary.open$, boundary.close);
  }
}

export type WindowBoundary<O = unknown> = BufferBoundary<O>;

export function window<T>(
  boundary: TimeBoundary | CountBoundary | OnBoundary | WhenBoundary<void>,
): OperatorFunction<T, Observable<T>>;
export function window<T, O>(boundary: ToggleBoundary<O>): OperatorFunction<T, Observable<T>>;
export function window<T, O>(boundary: WindowBoundary<O>): OperatorFunction<T, Observable<T>> {
  switch (boundary.kind) {
    case 'time':
      return rxWindowTime<T>(boundary.ms);
    case 'count':
      return rxWindowCount<T>(boundary.n);
    case 'on':
      return rxWindow<T>(boundary.signal$);
    case 'when':
      return rxWindowWhen<T>(() => boundary.make(undefined));
    case 'toggle':
      return rxWindowToggle<T, O>(boundary.open$, boundary.close);
  }
}

export type DebounceBoundary<T> = TimeBoundary | WhenBoundary<T>;

export function debounce<T>(boundary: DebounceBoundary<T>): MonoTypeOperatorFunction<T> {
  switch (boundary.kind) {
    case 'time':
      return rxDebounceTime(boundary.ms);
    case 'when':
      return rxDebounce(boundary.make);
  }
}

export type ThrottleBoundary<T> = TimeBoundary | WhenBoundary<T>;

export function throttle<T>(boundary: ThrottleBoundary<T>): MonoTypeOperatorFunction<T> {
  switch (boundary.kind) {
    case 'time':
      return rxThrottleTime(boundary.ms);
    case 'when':
      return rxThrottle(boundary.make);
  }
}

export type AuditBoundary<T> = TimeBoundary | WhenBoundary<T>;

export function audit<T>(boundary: AuditBoundary<T>): MonoTypeOperatorFunction<T> {
  switch (boundary.kind) {
    case 'time':
      return rxAuditTime(boundary.ms);
    case 'when':
      return rxAudit(boundary.make);
  }
}

export type SampleBoundary = TimeBoundary | OnBoundary;

export function sample<T>(boundary: SampleBoundary): MonoTypeOperatorFunction<T> {
  switch (boundary.kind) {
    case 'time':
      return rxSampleTime(boundary.ms);
    case 'on':
      return rxSample(boundary.signal$);
  }
}
