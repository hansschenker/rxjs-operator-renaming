import { describe, expect, it } from 'vitest';
import { Subject, defer } from 'rxjs';
import { shareLatest } from '../src/wrappers';

describe('shareLatest', () => {
  it('shares one subscription, replays the latest value, and resets on refCount zero', () => {
    const src = new Subject<number>();
    let subscriptions = 0;
    const shared = defer(() => {
      subscriptions += 1;
      return src;
    }).pipe(shareLatest());

    const a: number[] = [];
    const b: number[] = [];
    const subA = shared.subscribe((v) => a.push(v));
    src.next(1);
    src.next(2);

    const subB = shared.subscribe((v) => b.push(v));
    src.next(3);

    expect(a).toEqual([1, 2, 3]);
    expect(b).toEqual([2, 3]);
    expect(subscriptions).toBe(1);

    subA.unsubscribe();
    subB.unsubscribe();

    const c: number[] = [];
    shared.subscribe((v) => c.push(v));
    expect(subscriptions).toBe(2);
    expect(c).toEqual([]);
  });
});
