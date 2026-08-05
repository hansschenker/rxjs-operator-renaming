import { describe, expect, it } from 'vitest';
import { Subject, mergeMap, timer, toArray } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { count, on, time, toggle, until, when, whileTrue } from '../src/boundaries';
import { audit, buffer, debounce, sample, skip, take, throttle, window } from '../src/roots';
import { auditWhen, bufferOn, debounceWhen, sampleOn, throttleWhen } from '../src/operators';

const makeScheduler = (): TestScheduler =>
  new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

describe('take root', () => {
  it('take(count(3)) keeps the first three values', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('-a-b-c-d|');
      expectObservable(src.pipe(take(count(3)))).toBe('-a-b-(c|)');
    });
  });

  it('take(until(stop$)) completes when the notifier fires', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold(' a-b-c-d|');
      const stop = cold('-----x');
      expectObservable(src.pipe(take(until(stop)))).toBe('a-b-c|');
    });
  });

  it('take(time(5)) is the generated operator takeUntil(timer(5))', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b-c-d|');
      expectObservable(src.pipe(take(time(5)))).toBe('a-b-c|');
    });
  });

  it('take(whileTrue(p)) completes when the predicate fails', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b-c-d|', { a: 1, b: 2, c: 3, d: 4 });
      expectObservable(src.pipe(take(whileTrue((v: number) => v < 3)))).toBe('a-b-|', {
        a: 1,
        b: 2,
      });
    });
  });
});

describe('skip root', () => {
  it('skip(count(2)) drops the first two values', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b-c-d|');
      expectObservable(src.pipe(skip(count(2)))).toBe('----c-d|');
    });
  });

  it('skip(until(start$)) forwards values only after the notifier fires', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('  a-b-c-d|');
      const start = cold('---x');
      expectObservable(src.pipe(skip(until(start)))).toBe('----c-d|');
    });
  });

  it('skip(time(3)) is the generated operator skipUntil(timer(3))', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b-c-d|');
      expectObservable(src.pipe(skip(time(3)))).toBe('----c-d|');
    });
  });
});

describe('timing roots', () => {
  it('debounce(time(3)) emits the latest value after fixed silence', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('ab-------|');
      expectObservable(src.pipe(debounce(time(3)))).toBe('----b----|');
    });
  });

  it('debounceWhen gives each value its own silence signal', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b------|', { a: 5, b: 1 });
      expectObservable(src.pipe(debounceWhen((v: number) => timer(v)))).toBe('---b-----|', {
        b: 1,
      });
    });
  });

  it('throttle(time(4)) emits then suppresses for the fixed window', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('abcd-e---|');
      expectObservable(src.pipe(throttle(time(4)))).toBe('a----e---|');
    });
  });

  it('audit(time(3)) suppresses during the window and emits the latest at its end', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('ab-------|');
      expectObservable(src.pipe(audit(time(3)))).toBe('---b-----|');
    });
  });

  it('sample(on(signal$)) emits the latest value on each signal', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b-c---|');
      const sig = cold('---x---y|');
      expectObservable(src.pipe(sample(on(sig)))).toBe('---b---c|');
    });
  });

  it('sampleOn is the applied spelling of sample(on(signal$))', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b-c---|');
      const sig = cold('---x---y|');
      expectObservable(src.pipe(sampleOn(sig))).toBe('---b---c|');
    });
  });

  it('throttle(count(3)) keeps the first value of every block of three', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('abcdefgh|');
      expectObservable(src.pipe(throttle(count(3)))).toBe('a--d--g-|');
    });
  });

  it('sample(count(3)) keeps the last value of every full block of three', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('abcdefgh|');
      expectObservable(src.pipe(sample(count(3)))).toBe('--c--f--|');
    });
  });

  it('throttleWhen suppresses until the created signal fires', () => {
    const src = new Subject<number>();
    const close = new Subject<void>();
    const out: number[] = [];
    src.pipe(throttleWhen(() => close)).subscribe((v) => out.push(v));
    src.next(1);
    src.next(2);
    expect(out).toEqual([1]);
    close.next();
    src.next(3);
    expect(out).toEqual([1, 3]);
  });

  it('auditWhen emits the latest value when the created window closes', () => {
    const src = new Subject<number>();
    const close = new Subject<void>();
    const out: number[] = [];
    src.pipe(auditWhen(() => close)).subscribe((v) => out.push(v));
    src.next(1);
    src.next(2);
    expect(out).toEqual([]);
    close.next();
    expect(out).toEqual([2]);
  });
});

describe('buffer root', () => {
  it('buffer(count(2)) flushes every two values', () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const src = cold('a-b-c-d-|');
      expectObservable(src.pipe(buffer(count(2)))).toBe('--e---f-|', {
        e: ['a', 'b'],
        f: ['c', 'd'],
      });
    });
  });

  it('bufferOn(signal$) flushes on each signal', () => {
    const src = new Subject<number>();
    const sig = new Subject<void>();
    const out: number[][] = [];
    src.pipe(bufferOn(sig)).subscribe((v) => out.push(v));
    src.next(1);
    src.next(2);
    sig.next();
    src.next(3);
    sig.next();
    expect(out).toEqual([
      [1, 2],
      [3],
    ]);
  });

  it('buffer(when(make)) closes each cycle with a freshly created signal', () => {
    const src = new Subject<number>();
    const closings: Subject<void>[] = [];
    const makeClosing = (): Subject<void> => {
      const c = new Subject<void>();
      closings.push(c);
      return c;
    };
    const out: number[][] = [];
    src.pipe(buffer(when(makeClosing))).subscribe((v) => out.push(v));
    src.next(1);
    closings[0]!.next();
    src.next(2);
    src.next(3);
    closings[1]!.next();
    expect(out).toEqual([[1], [2, 3]]);
  });

  it('buffer(toggle(open$, close)) collects only between open and close signals', () => {
    const src = new Subject<number>();
    const open$ = new Subject<number>();
    const close$ = new Subject<void>();
    const out: number[][] = [];
    src.pipe(buffer(toggle(open$, () => close$))).subscribe((v) => out.push(v));
    src.next(1);
    open$.next(0);
    src.next(2);
    src.next(3);
    close$.next();
    src.next(4);
    expect(out).toEqual([[2, 3]]);
  });
});

describe('window root', () => {
  it('window(count(2)) routes values into inner observables of two', () => {
    const src = new Subject<number>();
    const out: number[][] = [];
    src
      .pipe(
        window(count(2)),
        mergeMap((w) => w.pipe(toArray())),
      )
      .subscribe((v) => out.push(v));
    src.next(1);
    src.next(2);
    src.next(3);
    src.complete();
    expect(out).toEqual([
      [1, 2],
      [3],
    ]);
  });
});
