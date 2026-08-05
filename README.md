# RxJS Operator Renaming Plan — "Keep the Root, Fix the Suffix"

Goal: rename RxJS operators to user-friendly names by **aliasing the official imports**
(zero-runtime re-exports), so that a name alone tells you the operator's behavior and
its argument type — without losing the bridge back to the official rxjs.dev docs.

Sources: the one-word/two-word tables, the suffix-meaning analysis
(`rxjs-operator-behavior-understood-from-their-names.txt`), the `...When` inconsistency
notes (`rxjs-operator-name-when-parts.txt`), the 8-policy framework and collision/
`OnComplete` advice (`Rxjs-operator-policy-renaming-operators-chatgpt.md`), and the
earlier alias experiments (`rxjs-operator-user-friendly-renaming.txt`).

---

## 1. Core principle

**Keep the first word (the family root) of every pipeable operator, every flattening
operator, and every aggregate operator.** `map`, `filter`, `take`, `skip`, `buffer`,
`window`, `debounce`, `throttle`, `audit`, `sample`, `delay`, `distinct`, `scan`,
`reduce`, `count`, `max`, `min`, and the four strategy words `concat` / `switch` /
`merge` / `exhaust` all stay. Renaming happens **only in the second word**, drawn from
a closed suffix vocabulary where each suffix has exactly one meaning.

This gives three guarantees:

1. **Docs bridge** — every vocabulary name starts with a word you can look up on rxjs.dev.
2. **Predictable signatures** — the suffix tells you the argument type before you read it.
3. **No collisions** — no new name shadows an existing RxJS export (the `mergeAll` lesson).

## 2. The suffix grammar (closed vocabulary)

| Suffix | Argument | Meaning |
| --- | --- | --- |
| *(bare root + number)* | `n` | implicit count: `take(3)`, `skip(2)` need no suffix |
| `Time` | `ms` | a **fixed clock duration** drives the boundary |
| `Count` | `n` | a **fixed number of values** drives the boundary |
| `While` | `predicate` | continue **as long as** the predicate holds |
| `Until` | `signal$` | a notifier observable ends it — **terminal, fires once** |
| `On` | `signal$` | act **each time** the notifier emits — repeating trigger |
| `When` | `factory → signal$` | **you create** the boundary signal per cycle / per value |
| `Toggle` | `open$, close` | act **between** explicit open and close signals |
| `With` | observables / values | join or extend the source with others |
| `Map` | `project → inner$` | map each value to an inner observable, flattened by the **root strategy** |
| `All` | — | flatten a higher-order observable by the **root strategy** |
| `Scan` | async accumulator | accumulate via inner observables by the **root strategy** |
| `By` | `key selector` | compare / group by a key |
| `OnComplete` | — | the result emits **only when the source completes** |

The four roots of the flattening families are a fixed strategy vocabulary and are never
reused for anything else:

| Root | Concurrency policy |
| --- | --- |
| `concat` | queue in order — one inner at a time, new work waits |
| `switch` | keep latest — new work cancels the previous inner |
| `merge` | run concurrently — inners overlap |
| `exhaust` | ignore while busy — new work is dropped until the inner completes |

## 3. FP-style construction — curried roots + partial application

The suffix grammar is not only a naming convention — it is the construction principle
of the library. Each suffix from §2 exists as a first-class **boundary combinator** (a
small tagged value), each family root is a **curried function** that takes a boundary
and returns the corresponding official pipeable operator, and every two-word
vocabulary name is a **named partial application** of its root.

### 3.1 Boundary combinators — the suffixes as values

```ts
export const time     = (ms: number)                  => ({ kind: 'time', ms }) as const;
export const count    = (n: number)                   => ({ kind: 'count', n }) as const;
export const whileTrue= <T>(p: (value: T) => boolean) => ({ kind: 'while', p }) as const;
export const until    = (signal$: Observable<unknown>)=> ({ kind: 'until', signal$ }) as const;
export const on       = (signal$: Observable<unknown>)=> ({ kind: 'on', signal$ }) as const;
export const when     = (make: () => Observable<unknown>) => ({ kind: 'when', make }) as const;
export const toggle   = (open$: Observable<unknown>, close: (o: unknown) => Observable<unknown>)
                                                      => ({ kind: 'toggle', open$, close }) as const;
```

(`while` is a JS keyword, hence `whileTrue`. Bare `time` and `count` are reserved for
boundaries inside the vocabulary — the aggregate operator is exported as
`countOnComplete`, so there is no internal collision.)

### 3.2 Curried roots — dispatch to the official operator

A root like `take` becomes one curried function that dispatches on the boundary kind
to the *exact* official RxJS operator. The FP layer adds construction sugar only —
runtime semantics are always the official implementation, never a reimplementation:

```ts
take(count(3))        // → rxjs take(3)
take(whileTrue(p))    // → rxjs takeWhile(p)
take(until(stop$))    // → rxjs takeUntil(stop$)

buffer(time(100))     // → bufferTime(100)
buffer(count(5))      // → bufferCount(5)
buffer(on(flush$))    // → buffer(flush$)
buffer(when(f))       // → bufferWhen(f)
buffer(toggle(o$, c)) // → bufferToggle(o$, c)

debounce(time(300))   // → debounceTime(300)
debounce(when(f))     // → rxjs debounce(f)
sample(on(tick$))     // → rxjs sample(tick$)
sample(time(100))     // → sampleTime(100)
```

Typing: a discriminated union over the boundary kinds with one overload per accepted
kind, so `take(until(s$))` is `MonoTypeOperatorFunction<T>` and an unsupported
combination (e.g. `map(time(5))`) is a **compile error**, not a runtime surprise.
TypeScript strict, no `any`.

### 3.3 The two-word names are named partial applications

```ts
export const takeUntil  = <T>(s$: Observable<unknown>) => take<T>(until(s$));
export const bufferTime = (ms: number) => buffer(time(ms));
export const bufferOn   = (s$: Observable<unknown>) => buffer(on(s$));
```

Every rename-table entry in §4 therefore has two equivalent spellings: the applied
name (`bufferOn(flush$)`) and the composed form (`buffer(on(flush$))`). The teaching
samples show the composed form — it makes the grammar visible — while application code
can use whichever reads better.

### 3.4 Flattening — derived from `map` + `All`

The four `*Map` operators follow the classic law `xMap(p) = map(p) → xAll`, so they
are partial applications of one builder over the strategy's `All` operator:

```ts
const mapThen = (flatten: () => OperatorFunction<Observable<R>, R>) =>
  <T, R>(project: (value: T) => Observable<R>) =>
  (src: Observable<T>) => src.pipe(map(project), flatten());

export const switchMap  = mapThen(switchAll);   // exported under the official names (§1)
export const concatMap  = mapThen(concatAll);
export const exhaustMap = mapThen(exhaustAll);
// mergeMap takes the concurrency limit through mergeAll(k)
```

(Practically these may still re-export the official operators for fidelity of edge
cases — the derivation is what the docs teach; the catalog records both.)

### 3.5 Aggregates — partial applications of `reduce`

`count`, `max`, `min`, `toArray` are `reduce` specializations
(`count = reduce(acc => acc + 1, 0)`, `toArray = reduce((a, v) => [...a, v], [])`),
exported as `countOnComplete` etc. per §4.5 and documented as such — one more place
where partial application *is* the explanation.

### 3.6 Bonus: the grammar generates operators RxJS never shipped

Because roots × boundaries compose, valid combinations that have no official operator
fall out as compositions of official ones:

```ts
take(time(ms))  // = takeUntil(timer(ms))  — "takeTime" does not exist in RxJS
skip(time(ms))  // = skipUntil(timer(ms))
```

Only combinations whose semantics are an unambiguous composition are enabled; the
rest stay compile errors.

## 4. What actually gets renamed

Most official names already obey the grammar and are **kept as-is**. Renames fix only
the violations. Full table (vocabulary name ⇐ official):

### 4.1 Timing / rate limiting — make `Time` vs `When` vs `On` systematic

| Vocabulary name | Official | Why |
| --- | --- | --- |
| `debounceWhen` | `debounce` | takes a per-value duration factory → `When` |
| `debounceTime` | *(keep)* | fixed duration ✓ |
| `throttleWhen` | `throttle` | duration-selector factory → `When` |
| `throttleTime` | *(keep)* | ✓ |
| `auditWhen` | `audit` | duration-selector factory → `When` |
| `auditTime` | *(keep)* | ✓ |
| `sampleOn` | `sample` | takes a notifier observable directly → `On` |
| `sampleTime` | *(keep)* | ✓ |
| `delay`, `delayWhen` | *(keep)* | `delayWhen` takes a per-value factory ✓ |
| `timeout` | *(keep)* | use config object; `timeoutWith` is legacy — excluded |

Result: every timing family reads the same way — `xxxTime(ms)` fixed clock,
`xxxWhen(factory)` dynamic signal you create, `xxxOn(signal$)` external trigger.

### 4.2 Buffer / window — same fix

| Vocabulary name | Official | Why |
| --- | --- | --- |
| `bufferOn` | `buffer` | flushes **each time** the notifier emits → `On` |
| `bufferTime` / `bufferCount` / `bufferToggle` / `bufferWhen` | *(keep)* | already grammar-conform |
| `windowOn` | `window` | same reasoning |
| `windowTime` / `windowCount` / `windowToggle` / `windowWhen` | *(keep)* | ✓ |

### 4.3 Filtering — fix the fake `Until`

| Vocabulary name | Official | Why |
| --- | --- | --- |
| `distinctFromPrevious` | `distinctUntilChanged` | "Until" without a notifier violated the grammar; new name says *compared with the previous value only* |
| `distinctFromPreviousBy` | `distinctUntilKeyChanged` | same + `By` = key selector |
| `distinct` | *(keep)* | document: unique across entire history |
| `ignoreValues` | `ignoreElements` | "elements" is jargon; keeps root `ignore` |
| `take`, `takeWhile`, `takeUntil`, `skip`, `skipWhile`, `skipUntil`, `skipLast` | *(keep)* | grammar-conform |
| `first`, `last`, `single`, `find`, `findIndex`, `elementAt`, `filter` | *(keep)* | already plain English |

### 4.4 Flattening — sacred, nothing renamed

`concatMap`, `switchMap`, `mergeMap`, `exhaustMap`, `concatAll`, `switchAll`,
`mergeAll`, `exhaustAll`, `mergeScan`, `switchScan`, `expand` — all kept. The teaching
work happens in docs: each is presented as **root strategy + suffix** with its
concurrency policy from the table in §2. The `*MapTo` variants are deprecated in RxJS
and excluded.

### 4.5 Aggregates — declare the completion dependency

Per the ChatGPT file's advice ("names that hide completion behavior get `OnComplete`"):

| Vocabulary name | Official |
| --- | --- |
| `reduceOnComplete` | `reduce` |
| `countOnComplete` | `count` |
| `maxOnComplete` | `max` |
| `minOnComplete` | `min` |
| `toArrayOnComplete` | `toArray` |
| `takeLastOnComplete` | `takeLast` |
| `scan` | *(keep — emits continuously, no suffix needed)* |

### 4.6 Outside the protected categories — free renames allowed

Creation and join functions are not pipeables, so friendlier names are fair game, but
only where the official name is genuinely opaque:

| Vocabulary name | Official | Note |
| --- | --- | --- |
| `whenAllReady` | `forkJoin` | from your earlier draft — the one notoriously opaque join name |
| `shareLatest()` | `shareReplay({ bufferSize: 1, refCount: true })` | thin **wrapper** (not alias) pinning the sane config; root `share` kept |
| `combineLatest`, `zip`, `race`, `merge`, `concat`, `partition`, `iif`, `defer`, `of`, `from`, `interval`, `timer`, `firstValueFrom`, `lastValueFrom` | *(keep)* | already descriptive |
| `startWith`, `endWith`, `withLatestFrom`, `combineLatestWith`, `zipWith`, `raceWith`, `concatWith`, `mergeWith` | *(keep)* | `With` grammar ✓ |
| `catchError`, `retry`, `tap`, `finalize`, `groupBy`, `pairwise` | *(keep)* | |

### 4.7 Excluded (deprecated / out of scope)

`retryWhen`, `repeatWhen`, `timeoutWith`, `mapTo`, `pluck`, `concatMapTo`,
`mergeMapTo`, `switchMapTo`, `publish*`, `multicast`, `refCount`, `toPromise` —
deprecated in RxJS 7/8; the vocabulary teaches the modern replacements
(`retry({ delay })`, `repeat({ delay })`, `timeout({ with })`, `map(() => v)`, `share`).
Scheduler operators (`observeOn`, `subscribeOn`) keep their official names and stay
outside the grammar (their `On` refers to a scheduler, not a signal).

## 5. Implementation

1. **Scaffold a small package** in this directory (`rxjs-friendly` working title):
   `package.json` (rxjs as peer dependency), strict `tsconfig.json`, tsup build,
   Vitest — matching the conventions of `rxjs-ds`.
2. **Single source of truth**: a `src/catalog.ts` array of
   `{ official, friendly, family, boundary, kind: 'alias' | 'partial' | 'wrapper' | 'keep' | 'excluded', story }`.
   The operator modules, the migration tables, and docs pages are all generated or
   derived from this one array so they can never drift.
3. **`src/boundaries.ts`** — the suffix combinators from §3.1 (`time`, `count`,
   `whileTrue`, `until`, `on`, `when`, `toggle`) as a tagged discriminated union.
4. **`src/roots.ts`** — the curried family roots (`take`, `skip`, `buffer`, `window`,
   `debounce`, `throttle`, `audit`, `sample`, …) with per-boundary overloads,
   dispatching to the official RxJS operators.
5. **`src/operators.ts`** — the exported vocabulary:
   - names that map 1:1 to an official operator with the same signature stay pure
     re-exports (`export { bufferWhen } from 'rxjs';`) — zero runtime cost;
   - the renamed/new names are named partial applications of the roots
     (`export const bufferOn = (s$) => buffer(on(s$));`);
   - `src/wrappers.ts` for the few configured wrappers (`shareLatest`), with explicit
     return types.
6. **Operator stories as docs**: every vocabulary entry carries its 8-policy story
   (Source → Trigger → Value → Cardinality → Time → Concurrency → Cancellation →
   Termination) — harvest the ready-made catalog from the ChatGPT markdown, swap in
   the new names.
7. **Tests**: Vitest — identity assertions for pure aliases
   (`expect(vocab.bufferWhen).toBe(rx.bufferWhen)`), marble tests for partial
   applications and wrappers (assert same behavior as the dispatched official
   operator), type-level tests that invalid root × boundary combinations fail to
   compile, and a collision test that walks the catalog and asserts no friendly name
   exists as an `rxjs` export (unless it aliases exactly that export).
8. **Migration tables**: generate `MIGRATION.md` (official → friendly and friendly →
   official) from the catalog.
9. **Docs site integration (follow-up)**: an operator-reference section in
   `rxjs-vitepress-ds` — one page per family using `ROperatorCard`: root, variants,
   suffix meanings, composed form, story, marble example. The suffix grammar table
   (§2) becomes the landing page — it is the actual teaching artifact.
10. **Optional lint nudge**: an ESLint `no-restricted-imports` preset for teaching
    samples so examples consistently import from the vocabulary module.

## 6. Defaults chosen (flag if you disagree)

- `take(3)` / `skip(2)` keep bare roots — a numeric argument is self-evident; no
  `takeCount` pedantry.
- The vocabulary exports **only** `reduceOnComplete` etc. for aggregates (not both
  names), keeping one obvious way per behavior.
- `delay(ms)` stays `delay` (no `delayTime` alias) — the pairing with `delayWhen`
  already disambiguates.
- Deprecated operators are fully excluded rather than tagged as legacy.
- Curried roots **dispatch** to official operators instead of reimplementing them;
  the `map + All` and `reduce` derivations (§3.4, §3.5) are teaching material, with
  pure re-exports used wherever behavioral fidelity matters.

## 7. Status

The package scaffold (§5, steps 1–5 and 7) is implemented:

- `src/boundaries.ts` — the suffix combinators (`time`, `count`, `whileTrue`,
  `until`, `on`, `when`, `toggle`) as a tagged discriminated union
- `src/roots.ts` — curried roots (`take`, `skip`, `buffer`, `window`, `debounce`,
  `throttle`, `audit`, `sample`) dispatching to the official operators, including
  the generated `take(time(ms))` / `skip(time(ms))`
- `src/operators.ts` — renamed aliases (pure re-exports) + named partial
  applications (`bufferOn`, `sampleOn`, `debounceWhen`, …)
- `src/wrappers.ts` — `shareLatest`
- `src/kept.ts` — grammar-conform official names re-exported for one-stop imports
- `src/catalog.ts` — the single source of truth (`catalog`, `keptOfficialNames`)
- `src/migration.ts` + `scripts/generate-migration.mjs` — `MIGRATION.md` generated
  from the catalog (`npm run generate:migration`); a drift test fails when the file
  on disk no longer matches the catalog
- `tests/` — 29 Vitest tests (marble + subject-driven + catalog consistency +
  migration drift) and compile-time assertions in `tests/type-errors.ts`
- `samples/buffer.ts` — the buffer family demo (`npx tsx samples/buffer.ts`)

Commands: `npm install`, `npm run typecheck`, `npm test`, `npm run build`,
`npm run generate:migration`.

Still open from §5: operator stories in the catalog (step 6), VitePress docs
integration (step 9), lint preset (step 10).
