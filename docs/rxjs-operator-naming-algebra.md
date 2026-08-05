---
title: The Operator Algebra
---

# The Renaming Vocabulary as an Operator Algebra

The renaming plan in the [main README](/) reads as a naming *convention*: keep the
root, fix the suffix, give every suffix exactly one meaning. But the implementation in
`src/boundaries.ts` and `src/roots.ts` is not a lookup table of renamed strings — it is
a small formal system. A closed set of **boundary values**, a set of **curried root
functions** that consume them, and a handful of **derivation laws** generate the entire
vocabulary, including two-word names, both spellings of every entry, and operators
RxJS itself never shipped. This page states that system as an algebra: its sorts, its
operations, its laws, and — just as important — what it does *not* cover.

Two names in the vocabulary denote the same operator exactly when they reduce to the
same composition. That reduction is what "algebra" means here, as opposed to "style
guide."

> **[Open the interactive root × boundary matrix →](/operator-algebra-matrix.html)**
> Every `root(boundary)` pair from §3–6 below, laid out as an 8×7 grid and
> color-coded by kept / renamed / generated / blocked.

## 1. Signature — sorts and operations

**Two sorts:**

- **`Boundary`** — the tagged values from `src/boundaries.ts`: `time`, `count`,
  `whileTrue`, `until`, `on`, `when`, `toggle`. A closed, seven-element vocabulary; no
  eighth boundary kind may be added without also re-deriving every root's overload set.
- **`Operator`** — the RxJS `OperatorFunction<T, R>` values a `.pipe()` call runs. This
  sort is not invented by the project; it is RxJS's own.

**Two families of operations:**

- **Boundary constructors** — `Value → Boundary`: `time(ms)`, `count(n)`,
  `whileTrue(predicate)`, `until(signal$)`, `on(signal$)`, `when(make)`,
  `toggle(open$, close)`.
- **Roots** — `Boundary ⇀ Operator` (partial, see §5): `take`, `skip`, `buffer`,
  `window`, `debounce`, `throttle`, `audit`, `sample`, each defined in `src/roots.ts` as
  a `switch` over the boundary's `kind` tag that dispatches to the exact official RxJS
  operator.

Every two-word vocabulary name is sugar over these two operation families:

```
rootSuffix(arg) := root(suffix(arg))
```

`bufferOn(flush$)` is not an independent definition — it *is* `buffer(on(flush$))`,
spelled as one identifier. This equation, not the rename table, is the source of the
vocabulary. `src/operators.ts` encodes it directly:

```ts
export const bufferOn = <T>(signal$: Observable<unknown>): OperatorFunction<T, T[]> =>
  buffer<T>(on(signal$));
```

## 2. The `Boundary` sort — closed vocabulary

| Constructor | Argument | Meaning |
| --- | --- | --- |
| `time(ms)` | `ms: number` | a fixed clock duration drives the boundary |
| `count(n)` | `n: number` | a fixed number of values drives the boundary |
| `whileTrue(p)` | `p: (value, index) => boolean` | continue as long as the predicate holds |
| `until(signal$)` | `Observable<unknown>` | a notifier ends it — terminal, fires once |
| `on(signal$)` | `Observable<unknown>` | act each time the notifier emits — repeating trigger |
| `when(make)` | `value → ObservableInput<unknown>` | you create the boundary signal per cycle / per value |
| `toggle(open$, close)` | `Observable<O>`, `O → Observable<unknown>` | act between explicit open and close signals |

Each constructor returns a value tagged with a `kind` discriminant
(`{ kind: 'time', ms }`, `{ kind: 'on', signal$ }`, …) — a discriminated union, not a
class hierarchy. That tag is the only thing a root switches on; the algebra has no
other source of truth about what a boundary *means*.

Bare numeric roots — `take(3)`, `skip(2)` — are the one deliberate escape hatch: a
number is self-evident, so no `count` wrapper is required at the call site even though
`take` dispatches on `count` internally.

## 3. Roots — the dispatch law

A root is a curried function from a boundary to the official operator that boundary
kind implies. `take` in full:

```ts
export type TakeBoundary<T> = CountBoundary | WhileBoundary<T> | UntilBoundary | TimeBoundary;

export function take<T>(boundary: TakeBoundary<T>): MonoTypeOperatorFunction<T> {
  switch (boundary.kind) {
    case 'count': return rxTake(boundary.n);
    case 'while': return rxTakeWhile(boundary.predicate, boundary.inclusive);
    case 'until': return rxTakeUntil(boundary.signal$);
    case 'time':  return rxTakeUntil(timer(boundary.ms));
  }
}
```

The root never reimplements behavior — every branch is a direct call into `rxjs`. This
is a deliberate constraint (README §3.2, §6): the FP layer is construction sugar, and
runtime semantics are always the official implementation. Consequently, the two
spellings of a vocabulary entry are not just equal in behavior — for the `alias` kind
they are the *same function reference*:

```ts
export { bufferWhen } from 'rxjs';              // kind: 'alias' — identity, not composition
export const bufferOn = (s$) => buffer(on(s$)); // kind: 'partial' — composition
```

`tests/catalog.spec.ts` and `tests/roots.spec.ts` check this distinction directly:
`expect(vocab.bufferWhen).toBe(rx.bufferWhen)` for aliases (reference equality), marble
equivalence against the dispatched official operator for partials (behavioral
equality, since a new closure is genuinely allocated).

## 4. Typing — a partial algebra by design

`Boundary ⇀ Operator` is written partial deliberately: not every root accepts every
boundary kind. Each root declares its own boundary union, and that union *is* the
root's arity in this algebra:

| Root | Accepted boundaries |
| --- | --- |
| `take`, `skip` | `count`, `whileTrue`, `until`, `time` |
| `buffer`, `window` | `time`, `count`, `on`, `when`, `toggle` |
| `debounce`, `audit` | `time`, `when` |
| `throttle` | `time`, `when`, `count` |
| `sample` | `time`, `on`, `count` |

A combination outside a root's declared union is a **compile error**, not a runtime
surprise — `map(time(5))` fails to type-check because `map` is not a root in this
algebra at all (it is grammar-conformant already and stays a `keep`, a sort mismatch
rather than an arity mismatch). `tests/type-errors.ts` asserts a battery of these
combinations are rejected by `tsc`.

The `switch` statements have no `default` case: TypeScript's exhaustiveness checking
over the boundary union *is* the proof that every declared boundary kind for that root
has a dispatch target. Add a boundary to a root's union without adding the matching
`case` and the file fails to compile — the type system enforces totality over each
root's own restricted domain, even though the algebra as a whole is partial.

## 5. Derivation laws — generating families from one generator

Two more laws sit above the root/boundary dispatch and generate whole operator
families from a single construction, rather than being written out per operator.

### 5.1 The flattening law: `xMap = map ∘ xAll`

The four `*Map` operators are one construction, parameterized by a second, orthogonal
closed vocabulary — the **strategy** sort (`concat`, `switch`, `merge`, `exhaust`),
distinct from the boundary sort and never reused for anything else:

```ts
const mapThen = (flatten: () => OperatorFunction<Observable<R>, R>) =>
  <T, R>(project: (value: T) => Observable<R>) =>
  (src: Observable<T>) => src.pipe(map(project), flatten());

concatMap  = mapThen(concatAll);
switchMap  = mapThen(switchAll);
exhaustMap = mapThen(exhaustAll);
```

This is the law the docs teach (README §3.4); in `src/kept.ts` the four `*Map`
operators are still pure re-exports of the official implementations, for fidelity of
edge cases the derivation glosses over. The catalog records the law as the operator's
`behavior`/`story`, independent of which implementation strategy the module uses at
runtime — the algebra states an *equivalence*, not a mandate on how to compile it.

### 5.2 The aggregate law: `reduce` specialization

`count`, `max`, `min`, `toArray` are specializations of `reduce`:
`count = reduce(acc => acc + 1, 0)`, `toArray = reduce((a, v) => [...a, v], [])`. The
vocabulary exposes them with the `OnComplete` suffix (`countOnComplete`, …) to name a
property the official names hide: the result is only ever emitted once the source
completes. `OnComplete` is not a `Boundary` — it carries no argument and dispatches
through no root — it is a documentation suffix attached by the aggregate law, distinct
from the seven-element boundary grammar in §2.

## 6. Closure — operators the algebra generates that RxJS never shipped

Because a root is just "dispatch on boundary kind," any well-typed
`root(boundary)` pair is a legitimate value of the algebra, whether or not RxJS ships
an official operator with that exact name:

```ts
take(time(ms))     // = takeUntil(timer(ms))                     — "takeTime" does not exist
skip(time(ms))     // = skipUntil(timer(ms))                     — "skipTime" does not exist
throttle(count(n)) // = filter((_, i) => i % n === 0)             — first of every block of n
sample(count(n))   // = filter((_, i) => i % n === n - 1)         — last of every block of n
```

`take`/`skip` accepting `time` and `throttle`/`sample` accepting `count` are not
present in the accepted-boundary table by accident — they are the algebra's closure
property made concrete: the space of sound `root × boundary` pairs is larger than the
set of operators RxJS happened to name, and the unnamed ones are still constructible,
typed, and tested (`samples/take-skip.ts` exercises all four `take`/`skip` boundaries
including the generated `time` case). Only combinations whose semantics are an
unambiguous composition are enabled; everything else is excluded from the boundary
union and therefore a compile error, never a guess.

## 7. Outside the algebra

Not every catalog entry is a constructed value. `src/catalog.ts`'s `EntryKind` names
the distinction explicitly:

| `EntryKind` | Algebra role |
| --- | --- |
| `boundary` | a constructor of the `Boundary` sort (§2) |
| `root` | a dispatch function `Boundary ⇀ Operator` (§3–4) |
| `alias` | identity — a rename with no composition, re-exported unchanged |
| `partial` | a named partial application `root(boundary)` (§3) |
| `wrapper` | *not* a composition of the algebra — a fixed configuration of one official operator (`shareLatest = () => shareReplay({ bufferSize: 1, refCount: true })`) |
| `keep` | already grammar-conformant; outside the rename surface entirely |
| `excluded` | outside the algebra's domain — deprecated operators (`retryWhen`, `mapTo`, `publish*`, …); the catalog points to their modern replacement instead of a boundary/root pair |

Wrappers and kept/excluded names matter for completeness of the vocabulary, but they
are not evidence of the algebra's generative power the way §3–6 are — they are the
edges where the system deliberately stops generating and just re-exports or redirects.

## 8. Single source of truth

`src/catalog.ts` is the algebra written down as data: one row per constructed value,
carrying its `kind`, its official target, its composed spelling where one exists, and
an 8-policy operator story (Source → Trigger → Value → Cardinality → Time →
Concurrency → Cancellation → Termination) as its semantics. `MIGRATION.md`, the
VitePress vocabulary pages, and the ESLint preset are all *generated* from this array
(`scripts/generate-migration.mjs`, `scripts/generate-docs.mjs`,
`scripts/generate-lint.mjs`), with drift tests that fail if the generated artifact and
the catalog disagree. The algebra, not any individual document, is authoritative —
these pages are views over it.

## 9. Map — algebra term to code location

| Algebra term | Location |
| --- | --- |
| `Boundary` sort, constructors | `src/boundaries.ts` |
| Roots, dispatch law, per-root boundary unions | `src/roots.ts` |
| Named partial applications (two-word vocabulary) | `src/operators.ts` |
| Pure-alias identities | `src/operators.ts` (re-exports), `src/kept.ts` |
| Flattening law (§5.1) | README §3.4; runtime re-exports in `src/kept.ts` |
| Aggregate law (§5.2) | `src/operators.ts` re-exports (`reduceOnComplete`, …) |
| Configured wrappers | `src/wrappers.ts` |
| Single source of truth | `src/catalog.ts` |
| Typing proofs (rejection of ill-typed combinations) | `tests/type-errors.ts` |
| Identity / behavioral equality tests | `tests/catalog.spec.ts`, `tests/roots.spec.ts` |
