import { shareReplay } from 'rxjs';
import type { MonoTypeOperatorFunction } from 'rxjs';

/**
 * Configured wrappers — thin typed functions pinning a sane configuration of
 * an official operator.
 */

/** Share one subscription and replay the latest value to late subscribers. */
export const shareLatest = <T>(): MonoTypeOperatorFunction<T> =>
  shareReplay<T>({ bufferSize: 1, refCount: true });
