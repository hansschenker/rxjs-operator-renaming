/**
 * The buffer family in the friendly vocabulary — one root, five boundaries.
 *
 * Official RxJS spreads the behavior over five names with three suffix
 * meanings; here every variant is the same root `buffer` applied to a
 * boundary, and the name of the boundary tells you the argument type:
 *
 *   buffer(count(n))        ⇐ bufferCount(n)         flush every n values
 *   buffer(time(ms))        ⇐ bufferTime(ms)         flush on a fixed clock
 *   buffer(on(signal$))     ⇐ buffer(signal$)        flush each time a signal emits
 *   buffer(when(make))      ⇐ bufferWhen(make)       you create each cycle's closing signal
 *   buffer(toggle(o$, c))   ⇐ bufferToggle(o$, c)    collect only between open and close
 *
 * Run with: npx tsx samples/buffer.ts
 */
import { Subject, interval, map, take as rxTake, timer } from 'rxjs';
import { buffer, bufferOn, count, on, time, toggle, when } from '../src/index';

// A stream of chat messages arriving quickly.
const message$ = new Subject<string>();

// 1. count — write chat history to disk in batches of 3.
message$
  .pipe(buffer(count(3)))
  .subscribe((batch) => console.log('save batch of 3:', batch));

// 2. time — refresh the unread-message badge at most once per second.
message$
  .pipe(buffer(time(1000)))
  .subscribe((batch) => console.log('badge update:', batch.length, 'new'));

// 3. on — flush pending analytics events when the user presses "send".
const send$ = new Subject<void>();
message$
  .pipe(buffer(on(send$)))
  .subscribe((batch) => console.log('analytics flush:', batch));

// ...or the applied spelling, same operator:
message$.pipe(bufferOn(send$)).subscribe((batch) => console.log('applied form:', batch));

// 4. when — close each batch after a quiet period that YOU define per cycle:
//    the factory runs again for every new buffer, so the closing rule can adapt.
message$
  .pipe(buffer(when(() => timer(500))))
  .subscribe((batch) => console.log('after 500ms cycle:', batch));

// 5. toggle — collect messages only while "do not disturb" is active,
//    delivering everything that arrived when it switches off.
const dndOn$ = new Subject<void>();
const dndOff$ = new Subject<void>();
message$
  .pipe(buffer(toggle(dndOn$, () => dndOff$)))
  .subscribe((batch) => console.log('missed while away:', batch));

// Drive the demo: a message every 200ms, ten in total.
interval(200)
  .pipe(
    rxTake(10),
    map((i) => `message ${i + 1}`),
  )
  .subscribe({
    next: (m) => {
      message$.next(m);
      if (m === 'message 2') dndOn$.next();
      if (m === 'message 5') dndOff$.next();
      if (m === 'message 7') send$.next();
    },
    complete: () => message$.complete(),
  });
