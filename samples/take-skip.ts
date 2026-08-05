/**
 * The take & skip families in the friendly vocabulary — two roots, four boundaries.
 *
 *   take(count(3))        // rxjs take(3)
 *   take(whileTrue(p))    // rxjs takeWhile(p)
 *   take(until(stop$))    // rxjs takeUntil(stop$)
 *   take(time(450))       // takeUntil(timer(450))  — generated: RxJS has no takeTime
 *
 *   skip(count(7))        // rxjs skip(7)
 *   skip(whileTrue(p))    // rxjs skipWhile(p)
 *   skip(until(start$))   // rxjs skipUntil(start$)
 *   skip(time(450))       // skipUntil(timer(450))  — generated: RxJS has no skipTime
 *
 * Run with: npx tsx samples/take-skip.ts
 */
import { Subject, interval, map } from 'rxjs';
import { count, skip, take, time, until, whileTrue } from '../src/index';

// Temperature readings arriving every 100ms: 18, 19, 20, ... 27 °C.
const reading$ = new Subject<number>();

// count — keep the first three readings.
reading$
  .pipe(take(count(3)))
  .subscribe((v) => console.log('first three:', v));

// whileTrue — keep readings while below 22°; completes at the first warm one.
reading$
  .pipe(take(whileTrue((v: number) => v < 22)))
  .subscribe((v) => console.log('below threshold:', v));

// until — keep readings until the user presses stop.
const stop$ = new Subject<void>();
reading$
  .pipe(take(until(stop$)))
  .subscribe((v) => console.log('until stop:', v));

// time — keep everything from the first 450ms; no official takeTime exists.
reading$
  .pipe(take(time(450)))
  .subscribe((v) => console.log('first 450ms:', v));

// skip mirrors take: drop the warmup instead of keeping the prefix.
reading$
  .pipe(skip(count(7)))
  .subscribe((v) => console.log('skip first seven:', v));

reading$
  .pipe(skip(whileTrue((v: number) => v < 25)))
  .subscribe((v) => console.log('once hot (>= 25):', v));

const calibrated$ = new Subject<void>();
reading$
  .pipe(skip(until(calibrated$)))
  .subscribe((v) => console.log('after calibration:', v));

reading$
  .pipe(skip(time(450)))
  .subscribe((v) => console.log('after 450ms:', v));

// Drive the demo: signals fire just before the reading of the same tick,
// so the output is deterministic.
interval(100)
  .pipe(
    take(count(10)),
    map((i) => 18 + i),
  )
  .subscribe({
    next: (v) => {
      if (v === 21) calibrated$.next();
      if (v === 23) stop$.next();
      reading$.next(v);
    },
    complete: () => reading$.complete(),
  });
