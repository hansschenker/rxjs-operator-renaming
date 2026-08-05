/**
 * Compile-time assertions, checked by `npm run typecheck` — invalid
 * root × boundary combinations must be compile errors, not runtime surprises.
 * This file is intentionally never executed.
 */
import { of } from 'rxjs';
import { count, toggle, whileTrue } from '../src/boundaries';
import { buffer, debounce, sample, take } from '../src/roots';

// @ts-expect-error take does not accept a toggle boundary
of(1).pipe(take(toggle(of(1), () => of(1))));

// @ts-expect-error debounce does not accept a count boundary
of(1).pipe(debounce(count(3)));

// @ts-expect-error buffer does not accept a while boundary
of(1).pipe(buffer(whileTrue((v: number) => v > 0)));

// @ts-expect-error sample does not accept a count boundary
of(1).pipe(sample(count(2)));
