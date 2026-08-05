SourceEachSourceValue-
TriggerOnSourceNext-
ValueMapToInnerObservable-
CardinalityOneSourceNextToManyInnerNexts-
TimeLatestInnerDefinesEmissionTime-
ConcurrencyOnlyLatestInnerActive-
CancellationCancelPreviousInnerOnNewSourceNext-
TerminationCompleteAfterSourceAndLatestInnerCompleteErrorWhenSourceOrInnerErrors



each source value
triggers a next value
the value gets mapped into a inner observable
the latest inner value defines the Emission time
only the latest source value emitts to inner
when the source emits the previous source value is unsubscribed from
when the latest inner observable completes the source completes
if inner observable or source observable Errors source terminates

| Issue                                          | Suggestion                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Some custom names collide with real RxJS names | Avoid `mergeAll` as a custom name for `merge`, because `mergeAll` already exists.                      |
| Some names hide completion behavior            | Add `OnComplete` for `reduce`, `toArray`, `count`, `max`, `min`, `takeLast`.                           |
| Some names use implementation words            | Replace `Factory` with `Boundary`, `Signal`, or `ClosingSignal` where possible.                        |
| Flattening names should expose policy          | Use your canonical policy names: `allowConcurrent`, `queueWhileBusy`, `keepLatest`, `ignoreWhileBusy`. |
| `audit` is not “after silence”                 | Reserve “silence” for `debounce`; use “gate/cooldown/window closes” for `audit`.                       |


| RxJS operator   |       Your name | My suggested alternative | Reason                                                                   |
| --------------- | --------------: | -----------------------: | ------------------------------------------------------------------------ |
| `map`           | `transformWith` |      `transformEachWith` | Makes clear that every next value is transformed.                        |
| `filter`        |        `keepIf` |                 `keepIf` | Excellent. Positive predicate naming is ideal.                           |
| `combineLatest` | `latestFromAll` |    `combineLatestValues` | Keeps “combine” and “latest” visible.                                    |
| `concat`        | `runInSequence` |          `runInSequence` | Good policy name: one after another.                                     |
| `forkJoin`      |    `waitForAll` | `waitForAllThenEmitLast` | More precise: emits last values only after all complete.                 |
| `merge`         |      `mergeAll` |        `runConcurrently` | Avoids collision with RxJS `mergeAll`.                                   |
| `partition`     |       `splitBy` |       `splitByPredicate` | Makes the predicate rule explicit.                                       |
| `race`          |   `firstToEmit` |        `useFirstEmitter` | Better: the winner stream is mirrored, not only its first value.         |
| `zip`           | `pairEmissions` |           `alignByIndex` | Works for more than two streams; values are joined by emission position. |


| RxJS operator  |               Your name |   My suggested alternative | Reason                                                                   |
| -------------- | ----------------------: | -------------------------: | ------------------------------------------------------------------------ |
| `buffer`       |    `collectUntilSignal` |       `collectUntilSignal` | Good.                                                                    |
| `bufferCount`  |              `collectN` |           `collectByCount` | More readable than `N`.                                                  |
| `bufferTime`   |    `collectForDuration` |            `collectByTime` | Shorter and symmetric with `collectByCount`.                             |
| `bufferToggle` | `collectBetweenSignals` |    `collectBetweenSignals` | Good.                                                                    |
| `bufferWhen`   |   `collectUntilFactory` |     `collectUntilBoundary` | “Factory” is implementation language; “boundary” describes the behavior. |
| `window`       |     `windowUntilSignal` |    `openWindowUntilSignal` | Emphasizes that it emits inner Observables, not arrays.                  |
| `windowCount`  |             `windowOfN` |            `windowByCount` | Symmetric with `collectByCount`.                                         |
| `windowTime`   |     `windowForDuration` |             `windowByTime` | Symmetric with `collectByTime`.                                          |
| `windowToggle` |  `windowBetweenSignals` | `openWindowBetweenSignals` | Makes opening/closing behavior explicit.                                 |
| `windowWhen`   |    `windowUntilFactory` |  `openWindowUntilBoundary` | Avoids implementation term “factory.”                                    |


| RxJS operator      |               Your name | My suggested alternative | Reason                                                     |
| ------------------ | ----------------------: | -----------------------: | ---------------------------------------------------------- |
| `mergeMap`         | `transformConcurrently` |        `allowConcurrent` | Matches your policy vocabulary: overlap is allowed.        |
| `concatMap`        | `transformSequentially` |         `queueWhileBusy` | New values wait while the current inner stream is active.  |
| `switchMap`        |    `transformSwitching` |             `keepLatest` | The latest value wins; previous inner stream is cancelled. |
| `exhaustMap`       |    `transformIfNotBusy` |        `ignoreWhileBusy` | New values are ignored while busy.                         |
| `mergeAll`         |      `joinConcurrently` |    `flattenConcurrently` | More precise for Observable-of-Observables.                |
| `concatAll`        |      `joinSequentially` |    `flattenSequentially` | Makes the higher-order flattening visible.                 |
| `switchAll`        |         `joinSwitching` |          `flattenLatest` | Only the latest inner Observable remains active.           |
| `exhaustAll`       |         `joinIfNotBusy` |  `flattenFirstUntilDone` | First inner wins until it completes.                       |
| `combineLatestAll` |      `combineAllLatest` |     `combineInnerLatest` | Signals that the source emits inner Observables.           |

allowConcurrent(project)      // mergeMap
queueWhileBusy(project)       // concatMap
keepLatest(project)           // switchMap
ignoreWhileBusy(project)      // exhaustMap

| RxJS operator |                Your name | My suggested alternative | Reason                                                                  |
| ------------- | -----------------------: | -----------------------: | ----------------------------------------------------------------------- |
| `scan`        |             `accumulate` |     `accumulateOverTime` | Distinguishes it from `reduce`, which emits only on completion.         |
| `reduce`      |               `foldInto` |         `foldOnComplete` | Makes completion dependency explicit.                                   |
| `mergeScan`   | `accumulateConcurrently` |  `accumulateWithOverlap` | Emphasizes concurrent inner accumulation.                               |
| `switchScan`  |    `accumulateSwitching` |       `accumulateLatest` | Shorter and aligned with `keepLatest`.                                  |
| `pairwise`    |           `withPrevious` |           `withPrevious` | Excellent.                                                              |
| `groupBy`     |              `groupInto` |             `groupByKey` | More conventional and precise.                                          |
| `pluck`       |           `pickProperty` |               `pickPath` | `pluck` can select nested properties; also keep this in legacy section. |
| `mapTo`       |            `replaceWith` |        `replaceEachWith` | More explicit that every source value is replaced.                      |


| RxJS operator             |               Your name |      My suggested alternative | Reason                                                |
| ------------------------- | ----------------------: | ----------------------------: | ----------------------------------------------------- |
| `debounce`                |          `afterSilence` |            `emitAfterSilence` | Better verb phrase.                                   |
| `debounceTime`            |        `afterSilenceOf` |         `emitAfterSilenceFor` | Makes fixed duration explicit.                        |
| `audit`                   | `emitLatestAfterSignal` |    `emitLatestWhenGateCloses` | Avoids confusing `audit` with debounce-style silence. |
| `auditTime`               |  `emitLatestAfterDelay` |     `emitLatestAfterCooldown` | Better describes the audit window.                    |
| `sample`                  |            `snapshotOn` |                  `snapshotOn` | Excellent.                                            |
| `sampleTime`              |         `snapshotEvery` |               `snapshotEvery` | Excellent.                                            |
| `throttle`                |             `limitRate` |     `emitFirstThenPauseUntil` | More precise for default throttle behavior.           |
| `throttleTime`            |           `limitRateTo` |       `emitFirstThenPauseFor` | Makes the leading-value policy explicit.              |
| `distinct`                |          `uniqueValues` |               `keepNewValues` | Better stream action phrase.                          |
| `distinctUntilChanged`    |        `skipDuplicates` |   `skipConsecutiveDuplicates` | Important: only adjacent duplicates are skipped.      |
| `distinctUntilKeyChanged` |      `skipDuplicatesBy` | `skipConsecutiveDuplicatesBy` | Same precision improvement.                           |
| `take`                    |               `limitTo` |                  `takeFirstN` | More precise: takes from the beginning.               |
| `takeLast`                |                 `lastN` |         `takeLastNOnComplete` | It must wait for completion.                          |
| `skip`                    |             `dropFirst` |                  `dropFirstN` | `skip(3)` drops N values, not only one.               |
| `skipLast`                |              `dropLast` |                   `dropLastN` | Same precision.                                       |
| `takeWhile`               |           `stopWhenNot` |                   `keepWhile` | Positive predicate name reads better.                 |
| `takeUntil`               |              `stopWhen` |                    `stopWhen` | Excellent.                                            |
| `skipUntil`               |      `startAfterSignal` |           `startWhenSignaled` | Slightly cleaner.                                     |
| `ignoreElements`          |        `suppressValues` |                `ignoreValues` | Shorter and matches behavior.                         |
| `single`                  |            `exactlyOne` |           `requireExactlyOne` | Captures the error condition better.                  |


| RxJS operator     |              Your name |            My suggested alternative | Reason                                                                                                                                |
| ----------------- | ---------------------: | ----------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| `share`           |           `shareAmong` |              `shareWhileSubscribed` | Captures the ref-count lifecycle better. `share` multicasts with one underlying subscription while subscribers exist. ([rxjs.dev][1]) |
| `multicast`       |             `shareVia` |                   `shareViaSubject` | Makes the Subject bridge explicit.                                                                                                    |
| `publish`         |              `makeHot` |                   `makeConnectable` | More precise: `publish` creates a connectable Observable.                                                                             |
| `publishBehavior` |    `makeHotWithLatest` |   `makeConnectableWithCurrentValue` | BehaviorSubject gives current/latest value to late subscribers.                                                                       |
| `publishReplay`   |    `makeHotWithReplay` |         `makeConnectableWithReplay` | Good, but “connectable” is more exact than “hot.”                                                                                     |
| `publishLast`     | `makeHotWithLastValue` | `makeConnectableWithLastOnComplete` | Completion dependency is important.                                                                                                   |

[1]: https://rxjs.dev/api/operators/share?utm_source=chatgpt.com "share"


| RxJS operator |           Your name | My suggested alternative | Reason                                                                        |
| ------------- | ------------------: | -----------------------: | ----------------------------------------------------------------------------- |
| `catchError`  |       `handleError` |            `recoverWith` | Better: it replaces the failed stream with another Observable.                |
| `retry`       |          `tryAgain` |           `retryOnError` | More explicit that retry is triggered by error.                               |
| `retryWhen`   | `retryWhenSignaled` |   `retryWithDelaySignal` | Good legacy name, but modern RxJS prefers `retry({ delay })`. ([rxjs.dev][1]) |

[1]: https://rxjs.dev/api/deprecations?utm_source=chatgpt.com "Deprecations"

| RxJS operator   |            Your name | My suggested alternative | Reason                                                                             |
| --------------- | -------------------: | -----------------------: | ---------------------------------------------------------------------------------- |
| `tap`           |         `sideEffect` |            `inspectWith` | Better for debugging/logging; `sideEffect` is accurate but noun-like.              |
| `delay`         |            `delayBy` |           `shiftLaterBy` | Makes clear that time is shifted forward.                                          |
| `delayWhen`     |   `delayUntilSignal` |  `shiftLaterUntilSignal` | Symmetric with `shiftLaterBy`.                                                     |
| `materialize`   | `wrapAsNotification` |         `eventsAsValues` | Strong book-friendly name: next/error/complete become values.                      |
| `dematerialize` | `unwrapNotification` |         `valuesAsEvents` | Clear inverse of `eventsAsValues`.                                                 |
| `observeOn`     |         `scheduleOn` |              `deliverOn` | More precise: it controls delivery of notifications.                               |
| `subscribeOn`   |     `subscribeUsing` |                `startOn` | More precise: it controls when/where subscription starts.                          |
| `timestamp`     |      `withTimestamp` |          `stampWithTime` | Both are good; your current name is clear.                                         |
| `timeInterval`  |   `withTimeInterval` | `measureGapFromPrevious` | More precise: measures elapsed time since previous emission.                       |
| `timeout`       |          `failAfter` |          `failIfTooSlow` | More domain-readable.                                                              |
| `timeoutWith`   |      `fallbackAfter` |      `fallbackIfTooSlow` | Good legacy name, but modern RxJS prefers `timeout` configuration. ([rxjs.dev][1]) |
| `toArray`       |         `collectAll` |   `collectAllOnComplete` | Completion dependency is important.                                                |

[1]: https://rxjs.dev/api/deprecations?utm_source=chatgpt.com "Deprecations"

| RxJS operator    |         Your name | My suggested alternative | Reason                                     |
| ---------------- | ----------------: | -----------------------: | ------------------------------------------ |
| `defaultIfEmpty` |       `orDefault` |       `defaultWhenEmpty` | More explicit about empty-completion case. |
| `every`          |        `allMatch` |               `allMatch` | Excellent.                                 |
| `find`           |      `firstMatch` |             `firstMatch` | Excellent.                                 |
| `findIndex`      | `firstMatchIndex` |        `firstMatchIndex` | Excellent.                                 |
| `isEmpty`        |     `hasNoValues` |  `hasNoValuesOnComplete` | Makes completion dependency explicit.      |
| `count`          |     `countValues` |        `countOnComplete` | Emits only after source completes.         |
| `max`            |         `maximum` |      `maximumOnComplete` | Completion dependency again.               |
| `min`            |         `minimum` |      `minimumOnComplete` | Symmetric with `maximumOnComplete`.        |


transformEachWith       // map
keepIf                  // filter

allowConcurrent         // mergeMap
queueWhileBusy          // concatMap
keepLatest              // switchMap
ignoreWhileBusy         // exhaustMap

accumulateOverTime      // scan
foldOnComplete          // reduce

snapshotOn              // sample
snapshotEvery           // sampleTime
emitAfterSilenceFor     // debounceTime
emitLatestAfterCooldown // auditTime

shareWhileSubscribed    // share
recoverWith             // catchError
recoverAsAction         // domain-specific catchError
startWithInitial        // startWith, especially for state streams

| Policy axis                                | Question                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| **1. Source policy**                       | What source values or source Observables are involved?                            |
| **2. Trigger policy**                      | What causes output: source emission, signal emission, timer, completion, error?   |
| **3. Value policy**                        | Are values transformed, replaced, grouped, accumulated, paired, ignored?          |
| **4. Cardinality policy**                  | One value in / one out, subset, many-to-one, one-to-many, none?                   |
| **5. Time policy**                         | Immediate, delayed, periodic, after silence, until signal, over duration?         |
| **6. Concurrency policy**                  | Allow overlap, queue, switch to latest, ignore while busy?                        |
| **7. Cancellation policy**                 | Does a new value cancel previous work? Does a signal stop the stream?             |
| **8. Completion / error / sharing policy** | Does it wait for completion, preserve errors, recover errors, share subscription? |


| RxJS operator    | Policy-based custom name                                                                |
| ---------------- | --------------------------------------------------------------------------------------- |
| `map`            | `forEachSourceValueTransformValueWithFunctionAndEmitOneResultImmediately`               |
| `filter`         | `forEachSourceValueKeepOnlyValuesWherePredicateReturnsTrueAndDropTheRest`               |
| `scan`           | `forEachSourceValueUpdateRememberedStateAndEmitNewStateImmediately`                     |
| `reduce`         | `accumulateAllSourceValuesSilentlyAndEmitFinalAccumulatedResultOnlyWhenSourceCompletes` |
| `tap`            | `forEachSourceValueRunSideEffectWithoutChangingValueTimingCompletionOrError`            |
| `ignoreElements` | `dropAllNextValuesButPreserveErrorAndCompletionNotifications`                           |

| RxJS operator             | Policy-based custom name                                              |
| ------------------------- | --------------------------------------------------------------------- |
| `filter`                  | `keepValuesWhilePredicateIsTrueAndDropValuesWherePredicateIsFalse`    |
| `first`                   | `emitFirstMatchingValueThenCompleteImmediately`                       |
| `last`                    | `rememberLastMatchingValueAndEmitItOnlyWhenSourceCompletes`           |
| `single`                  | `requireExactlyOneMatchingValueOrErrorIfZeroOrMoreThanOne`            |
| `take`                    | `emitFirstNValuesThenCompleteAndCancelSourceSubscription`             |
| `takeLast`                | `bufferLastNValuesAndEmitThemOnlyWhenSourceCompletes`                 |
| `takeWhile`               | `emitValuesWhilePredicateIsTrueThenCompleteWhenPredicateBecomesFalse` |
| `takeUntil`               | `emitSourceValuesUntilStopSignalEmitsThenCompleteAndCancelSource`     |
| `skip`                    | `dropFirstNValuesThenPassThroughRemainingValues`                      |
| `skipLast`                | `delayValuesThroughBufferAndDropFinalNValuesOnCompletion`             |
| `skipWhile`               | `dropValuesWhilePredicateIsTrueThenPassThroughAllRemainingValues`     |
| `skipUntil`               | `dropSourceValuesUntilStartSignalEmitsThenPassThroughRemainingValues` |
| `distinct`                | `emitOnlyValuesNotSeenBeforeAcrossEntireStreamHistory`                |
| `distinctUntilChanged`    | `dropOnlyConsecutiveDuplicateValuesComparedWithPreviousValue`         |
| `distinctUntilKeyChanged` | `dropOnlyConsecutiveDuplicateValuesComparedBySelectedObjectKey`       |
| `elementAt`               | `dropAllValuesExceptValueAtRequestedIndexThenComplete`                |

| RxJS operator  | Policy-based custom name                                                           |
| -------------- | ---------------------------------------------------------------------------------- |
| `debounce`     | `waitForPerValueSilenceSignalThenEmitOnlyLatestValueIfNotReplaced`                 |
| `debounceTime` | `waitForFixedSilenceDurationThenEmitOnlyLatestValueIfNotReplaced`                  |
| `audit`        | `ignoreSourceValuesDuringSignalWindowThenEmitLatestBufferedValueWhenWindowCloses`  |
| `auditTime`    | `ignoreSourceValuesDuringFixedCooldownThenEmitLatestBufferedValueWhenCooldownEnds` |
| `throttle`     | `emitFirstValueImmediatelyThenIgnoreValuesUntilDurationSignalCompletes`            |
| `throttleTime` | `emitFirstValueImmediatelyThenIgnoreValuesForFixedDuration`                        |
| `sample`       | `emitLatestSourceValueOnlyWhenSamplerSignalEmits`                                  |
| `sampleTime`   | `emitLatestSourceValueAtRegularTimeIntervals`                                      |
| `delay`        | `shiftEverySourceValueLaterByFixedDurationWithoutChangingValueOrder`               |
| `delayWhen`    | `shiftEachSourceValueLaterUntilItsOwnDelaySignalEmits`                             |
| `timeout`      | `errorIfSourceDoesNotEmitWithinConfiguredTimeLimit`                                |
| `timeoutWith`  | `switchToFallbackObservableIfSourceDoesNotEmitWithinConfiguredTimeLimit`           |




| RxJS operator  | Policy-based custom name                                                                  |
| -------------- | ----------------------------------------------------------------------------------------- |
| `buffer`       | `collectSourceValuesIntoArrayUntilClosingSignalEmitsThenFlushArray`                       |
| `bufferCount`  | `collectSourceValuesIntoArrayUntilCountReachesNThenFlushArray`                            |
| `bufferTime`   | `collectSourceValuesIntoArrayForFixedDurationThenFlushArray`                              |
| `bufferToggle` | `openCollectionWhenOpenSignalEmitsAndFlushWhenMatchingCloseSignalEmits`                   |
| `bufferWhen`   | `collectSourceValuesIntoArrayUntilDynamicallyCreatedClosingSignalEmitsThenOpenNextBuffer` |
| `toArray`      | `collectAllSourceValuesIntoSingleArrayAndEmitOnlyWhenSourceCompletes`                     |

| RxJS operator  | Policy-based custom name                                                               |
| -------------- | -------------------------------------------------------------------------------------- |
| `window`       | `openInnerObservableWindowAndRouteSourceValuesUntilClosingSignalEmits`                 |
| `windowCount`  | `openInnerObservableWindowAndRouteNSourceValuesBeforeOpeningNextWindow`                |
| `windowTime`   | `openInnerObservableWindowForFixedDurationThenOpenNextWindow`                          |
| `windowToggle` | `openInnerObservableWindowWhenOpenSignalEmitsAndCloseWhenCloseSignalEmits`             |
| `windowWhen`   | `openInnerObservableWindowUntilDynamicallyCreatedClosingSignalEmitsThenOpenNextWindow` |



| RxJS operator | Long policy name                                                                                       | Short policy name       |
| ------------- | ------------------------------------------------------------------------------------------------------ | ----------------------- |
| `mergeMap`    | `mapEachSourceValueToInnerObservableSubscribeImmediatelyAllowConcurrentInnerStreamsAndMergeAllResults` | `allowConcurrent`       |
| `concatMap`   | `mapEachSourceValueToInnerObservableQueueWhilePreviousInnerIsActiveAndPreserveSourceOrder`             | `queueWhileBusy`        |
| `switchMap`   | `mapEachSourceValueToInnerObservableCancelPreviousInnerObservableAndEmitOnlyLatestInnerResults`        | `keepLatest`            |
| `exhaustMap`  | `mapSourceValueToInnerObservableOnlyWhenIdleAndIgnoreNewSourceValuesWhileInnerIsActive`                | `ignoreWhileBusy`       |
| `mergeAll`    | `subscribeToEachInnerObservableImmediatelyAllowConcurrentInnerStreamsAndMergeAllResults`               | `flattenConcurrently`   |
| `concatAll`   | `subscribeToEachInnerObservableSequentiallyWaitingForPreviousInnerToComplete`                          | `flattenSequentially`   |
| `switchAll`   | `subscribeToLatestInnerObservableAndCancelPreviousInnerObservable`                                     | `flattenLatest`         |
| `exhaustAll`  | `subscribeToFirstInnerObservableAndIgnoreNewInnerObservablesWhileBusy`                                 | `flattenFirstUntilDone` |




| RxJS operator    | Policy-based custom name                                                       |
| ---------------- | ------------------------------------------------------------------------------ |
| `combineLatest`  | `waitUntilEverySourceHasEmittedOnceThenEmitLatestValuesWheneverAnySourceEmits` |
| `withLatestFrom` | `whenPrimarySourceEmitsPairItWithLatestValuesFromSecondarySources`             |
| `zip`            | `waitUntilEachSourceHasNextValueThenEmitValuesAlignedByEmissionIndex`          |
| `forkJoin`       | `waitForAllSourcesToCompleteThenEmitEachSourcesLastValueOnce`                  |
| `concat`         | `subscribeToSourcesOneAfterAnotherWaitingForEachToCompleteBeforeStartingNext`  |
| `merge`          | `subscribeToAllSourcesImmediatelyAndEmitValuesFromAnySourceAsTheyArrive`       |
| `race`           | `subscribeToAllSourcesUseFirstSourceThatEmitsAndCancelAllOtherSources`         |
| `partition`      | `splitSourceIntoMatchingAndNonMatchingStreamsUsingPredicate`                   |


| RxJS operator | Policy-based custom name                                                        |
| ------------- | ------------------------------------------------------------------------------- |
| `catchError`  | `onErrorReplaceFailedSourceWithRecoveryObservableAndContinueWithRecoveryValues` |
| `retry`       | `onErrorResubscribeToSourceUpToConfiguredRetryLimit`                            |
| `retryWhen`   | `onErrorWaitForRetrySignalThenResubscribeToSource`                              |


| RxJS operator     | Policy-based custom name                                                             |
| ----------------- | ------------------------------------------------------------------------------------ |
| `share`           | `shareSingleSourceSubscriptionAmongSubscribersWhileSubscriberCountIsGreaterThanZero` |
| `multicast`       | `routeSingleSourceSubscriptionThroughProvidedSubjectToMultipleSubscribers`           |
| `publish`         | `makeSourceConnectableSoMultipleSubscribersShareOneSubscriptionAfterConnect`         |
| `publishBehavior` | `makeSourceConnectableAndReplayLatestValueToLateSubscribersUsingBehaviorSubject`     |
| `publishReplay`   | `makeSourceConnectableAndReplayBufferedPastValuesToLateSubscribers`                  |
| `publishLast`     | `makeSourceConnectableAndEmitOnlyLastValueAfterCompletionToSubscribers`              |


| RxJS operator  | Policy-based custom name                                                  |
| -------------- | ------------------------------------------------------------------------- |
| `observeOn`    | `rescheduleDeliveryOfNextErrorAndCompleteNotificationsOntoGivenScheduler` |
| `subscribeOn`  | `rescheduleSourceSubscriptionSideEffectOntoGivenScheduler`                |
| `timestamp`    | `attachCurrentSchedulerTimestampToEachSourceValue`                        |
| `timeInterval` | `attachElapsedTimeSincePreviousEmissionToEachSourceValue`                 |


| Order | Policy                  | Meaning                                                                             |
| ----: | ----------------------- | ----------------------------------------------------------------------------------- |
|     1 | **Source policy**       | Which source values or source Observables are involved?                             |
|     2 | **Trigger policy**      | What causes the operator to act? Source emission, signal, timer, completion, error? |
|     3 | **Value policy**        | Transform, keep, drop, replace, pair, group, accumulate?                            |
|     4 | **Cardinality policy**  | One-to-one, one-to-many, many-to-one, subset, none?                                 |
|     5 | **Time policy**         | Immediate, delayed, periodic, after silence, until signal?                          |
|     6 | **Concurrency policy**  | Allow overlap, queue, switch, ignore while busy?                                    |
|     7 | **Cancellation policy** | Does a new value cancel previous work? Does a signal stop the stream?               |
|     8 | **Termination policy**  | What happens with complete/error/sharing/reset?                                     |


| Slot | Policy                 |
| ---: | ---------------------- |
|    1 | **SourcePolicy**       |
|    2 | **TriggerPolicy**      |
|    3 | **ValuePolicy**        |
|    4 | **CardinalityPolicy**  |
|    5 | **TimePolicy**         |
|    6 | **ConcurrencyPolicy**  |
|    7 | **CancellationPolicy** |
|    8 | **TerminationPolicy**  |


map =
SourceEachSourceValue-TriggerOnSourceNext-ValueApplyProjectionFunction-CardinalityOneNextToOneNext-TimeImmediate-ConcurrencyNoInnerSubscription-CancellationNoInnerCancellation-TerminationForwardErrorAndComplete

filter =
SourceEachSourceValue-TriggerOnSourceNext-ValueKeepIfPredicateTrueDropIfFalse-CardinalityZeroOrOneNextPerSourceNext-TimeImmediate-ConcurrencyNoInnerSubscription-CancellationNoInnerCancellation-TerminationForwardErrorAndComplete


| Policy       | Behavior question               |
| ------------ | ------------------------------- |
| Source       | What flows into the operator?   |
| Trigger      | What activates the operator?    |
| Value        | What happens to the value?      |
| Cardinality  | How many values come out?       |
| Time         | Who controls timing?            |
| Concurrency  | Can work overlap?               |
| Cancellation | What gets stopped or discarded? |
| Termination  | What happens on complete/error? |


| Your wording                                                        | More precise wording                                                                                                               |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| “each source value triggers a next value”                           | each source **next notification** triggers the projection function                                                                 |
| “the latest inner value defines the emission time”                  | the latest **inner Observable** defines the emission time                                                                          |
| “only the latest source value emits to inner”                       | only the **inner Observable created from the latest source value** may emit to the result                                          |
| “the previous source value is unsubscribed from”                    | the previous **inner Observable subscription** is unsubscribed from                                                                |
| “when the latest inner observable completes the source completes”   | the **result Observable** completes only after the outer source has completed and the latest active inner Observable has completed |
| “if inner observable or source observable errors source terminates” | if the source or active inner Observable errors, the **result Observable** errors, unless recovered                                |


SourceEachSourceValue-
TriggerOnSourceNext-
ValueMapToInnerObservable-
CardinalityOneSourceNextToManyInnerNexts-
TimeLatestInnerDefinesEmissionTime-
ConcurrencyOnlyLatestInnerActive-
CancellationCancelPreviousInnerOnNewSourceNext-
TerminationCompleteAfterSourceAndLatestInnerCompleteErrorWhenSourceOrInnerErrors

switchMap operator story

A source Observable emits values over time.

Each source next(value) triggers the operator.

The source value is passed into a projection function.

The projection function maps the source value into an inner Observable.

One source value can therefore produce many inner values.

The emitted values of the result Observable come from the latest inner Observable.

The latest inner Observable defines the timing of the result emissions.

Only one inner Observable is active at a time.

When a new source value arrives, the previous inner Observable subscription is cancelled.

The old inner Observable is no longer allowed to emit values to the result Observable.

Only the inner Observable created from the latest source value may emit.

When the outer source Observable completes, the result Observable waits for the latest active inner Observable to complete.

Then the result Observable completes.

If the outer source Observable errors, the result Observable errors.

If the active inner Observable errors, the result Observable errors.

Unless the error is recovered, the stream terminates.

Shorter story version
Each source value starts new inner work.
The new inner Observable becomes the only active inner Observable.
The previous inner Observable is cancelled.
The result emits values only from the latest inner Observable.
The result completes after the source and latest inner complete.
Errors from the source or active inner terminate the result.

This gives us a very useful method:

8-policy name
→ split into 8 policy fragments
→ translate each fragment into one sentence
→ get the operator behavior story

So yes: the strict 8-policy name becomes the skeleton, and the operator story becomes the readable explanation of that skeleton.

as a final task and very helpful task, lets write the operator story for each operator in custom operators names list following your template:
- split into 8 policy fragments
- translate each fragment into one sentence
- get the operator behavior
this will give us now the full benefit for a standard Rxjs user

I’ll turn the custom-operator list into a reusable “operator story” catalog. To keep it useful for a standard RxJS user, each story will be short, practical, and derived from the same 8-policy order.

I’ll keep duplicate operators only once, because filter and partition appear in more than one section. Legacy operators such as pluck, mapTo, publish*, and retryWhen stay in the catalog because they are part of your uploaded list.

Thought for 1m 11s

Based on your uploaded custom-operator vocabulary, here is the full operator-story catalog. I keep the structure strict: Source → Trigger → Value → Cardinality → Time → Concurrency → Cancellation → Termination → Behavior.

RxJS Operator Stories from the 8 Policy Framework
Reading template

Every operator story follows the same order:

Source → Trigger → Value → Cardinality → Time → Concurrency → Cancellation → Termination

Then the final line gives the practical operator behavior.

Core value operators
map — transformWith

Source: Each source value flows into the operator.
Trigger: Every source next(value) activates the projection function.
Value: The projection function transforms the value.
Cardinality: One source value produces one result value.
Time: The result is emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: map rewrites each value as it passes through, without changing timing, sharing, cancellation, error, or completion behavior.

filter — keepIf

Source: Each source value flows into the predicate.
Trigger: Every source next(value) checks the predicate.
Value: Values that satisfy the predicate are kept.
Cardinality: One source value produces either one result value or no result value.
Time: Kept values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: filter lets only matching values continue through the stream.

Join creation operators
combineLatest — latestFromAll

Source: Multiple input Observables flow into one combined stream.
Trigger: After every input has emitted once, any new input value triggers output.
Value: The latest value from each input is combined into one tuple or array.
Cardinality: Many source streams produce one combined output stream.
Time: Output timing is controlled by whichever input emits next.
Concurrency: All input Observables are subscribed concurrently.
Cancellation: Unsubscribing cancels all input subscriptions.
Termination: The result completes when all inputs complete and errors when any input errors.

Operator behavior: combineLatest keeps the latest value from every source and emits a new combined snapshot whenever any source changes.

concat — runInSequence

Source: Multiple input Observables are arranged in sequence.
Trigger: The first Observable starts immediately, and the next starts only after the current one completes.
Value: Values are forwarded from the currently active Observable.
Cardinality: Many source streams become one sequential output stream.
Time: Timing is controlled by one source Observable at a time.
Concurrency: Only one input Observable is subscribed at a time.
Cancellation: Unsubscribing cancels the current active source and prevents later sources from starting.
Termination: The result completes after all sources complete, and errors if the active source errors.

Operator behavior: concat runs streams one after another, preserving source order and waiting for completion before moving on.

forkJoin — waitForAll

Source: Multiple input Observables are observed together.
Trigger: Output happens only when all inputs complete.
Value: The last value from each input is collected.
Cardinality: Many source streams produce one final combined value.
Time: Output happens only at completion time.
Concurrency: All input Observables are subscribed concurrently.
Cancellation: Unsubscribing cancels all input subscriptions.
Termination: The result emits once and completes after all inputs complete; it errors if any input errors.

Operator behavior: forkJoin waits for all streams to finish, then emits their final values as one result.

merge — mergeAll in uploaded list

Source: Multiple input Observables flow into one output stream.
Trigger: Any input next(value) triggers an output value.
Value: Values are forwarded unchanged from whichever source emits.
Cardinality: Many source streams become one interleaved output stream.
Time: Each value keeps the timing of its original source.
Concurrency: All input Observables are subscribed concurrently.
Cancellation: Unsubscribing cancels all input subscriptions.
Termination: The result completes when all inputs complete and errors when any input errors.

Operator behavior: merge lets all sources run at the same time and forwards values as they arrive.

partition — splitBy

Source: One source Observable is divided into two output Observables.
Trigger: Every source next(value) checks the predicate.
Value: Matching values go to the true stream, and non-matching values go to the false stream.
Cardinality: One source value is routed to one of two output streams.
Time: Routed values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Both output streams follow the source error and completion.

Operator behavior: partition splits one stream into two streams based on a predicate.

race — firstToEmit

Source: Multiple input Observables compete.
Trigger: The first input to emit, error, or complete becomes the winner.
Value: The winning Observable is mirrored.
Cardinality: Many competing sources become one winning output stream.
Time: Timing is controlled by the winning Observable.
Concurrency: All competitors are subscribed concurrently at the beginning.
Cancellation: Losing Observables are unsubscribed after the winner is chosen.
Termination: The result follows the winner’s error or completion.

Operator behavior: race subscribes to all competitors, keeps the first one that speaks, and cancels the rest.

zip — pairEmissions

Source: Multiple input Observables provide indexed values.
Trigger: Output happens when every input has one buffered value at the same emission index.
Value: Values with the same index are combined into a tuple or array.
Cardinality: One value from each source produces one combined output value.
Time: Output is paced by the slowest source.
Concurrency: All input Observables are subscribed concurrently.
Cancellation: Values wait in buffers until matching indexed partners arrive.
Termination: The result completes when no more complete pairs can be formed and errors when any input errors.

Operator behavior: zip aligns streams by emission position and emits one combined value per completed index group.

Buffer operators
buffer — collectUntilSignal

Source: One source Observable provides values, and one closing notifier provides flush signals.
Trigger: The closing notifier emits.
Value: Source values are collected into an array.
Cardinality: Many source values become one array value per closing signal.
Time: Buffer boundaries are controlled by the notifier.
Concurrency: The source and notifier are subscribed concurrently.
Cancellation: Unsubscribing clears the active buffer.
Termination: The active buffer is flushed on source completion, and errors are forwarded.

Operator behavior: buffer collects values until a signal arrives, then emits the collected array.

bufferCount — collectN

Source: One source Observable provides values.
Trigger: The buffer reaches the configured count.
Value: Values are collected into an array.
Cardinality: N source values become one array value.
Time: Time is count-based, not clock-based.
Concurrency: No inner Observable is created.
Cancellation: Unsubscribing drops active buffers.
Termination: A partial buffer may be flushed on completion, and errors are forwarded.

Operator behavior: bufferCount collects a fixed number of values and emits each collected group.

bufferTime — collectForDuration

Source: One source Observable provides values over time.
Trigger: A fixed time window closes.
Value: Values inside the time window are collected into an array.
Cardinality: Many source values in one time window become one array value.
Time: Fixed-duration windows control flushing.
Concurrency: Timers manage the active buffer windows.
Cancellation: Unsubscribing cancels timers and drops active buffers.
Termination: Active buffers are flushed on completion, and errors are forwarded.

Operator behavior: bufferTime collects values for a duration and emits arrays repeatedly over time.

bufferToggle — collectBetweenSignals

Source: One source Observable provides values, one signal opens buffers, and another signal closes them.
Trigger: An opening signal starts a buffer, and a closing signal flushes it.
Value: Values between opening and closing signals are collected into arrays.
Cardinality: Many source values per open-close window become one array.
Time: Buffer lifetime is defined by opening and closing signals.
Concurrency: Multiple buffers may be active at the same time.
Cancellation: Unsubscribing closes and discards active buffers.
Termination: Active buffers are flushed on source completion, and errors are forwarded.

Operator behavior: bufferToggle collects values only between explicit open and close signals.

bufferWhen — collectUntilFactory

Source: One source Observable provides values, and a closing selector creates boundary signals.
Trigger: The current closing signal emits.
Value: Values are collected into an array until the dynamic boundary closes.
Cardinality: Many source values per dynamic window become one array.
Time: Window timing is controlled by dynamically created closing Observables.
Concurrency: Usually one buffer is active at a time.
Cancellation: Unsubscribing cancels the active closing signal.
Termination: The active buffer is flushed on completion, and errors are forwarded.

Operator behavior: bufferWhen repeatedly collects values until a dynamically created boundary says “flush now.”

Higher-order transformation operators
concatMap — transformSequentially

Source: Each source value is used to create inner work.
Trigger: Every source next(value) calls the projection function.
Value: The source value is mapped to an inner Observable.
Cardinality: One source value may produce many inner values.
Time: Inner Observables define result timing.
Concurrency: Inner Observables are queued while one is active.
Cancellation: New source values do not cancel the active inner Observable.
Termination: The result completes after the source, the queue, and the active inner complete; errors terminate the result.

Operator behavior: concatMap turns values into inner Observables and runs them one after another in order.

concatMapTo — switchToSequentially

Source: Each source value triggers the same inner Observable.
Trigger: Every source next(value) requests the fixed inner Observable.
Value: The source value is replaced by the same inner Observable.
Cardinality: One source value may produce many inner values.
Time: The fixed inner Observable defines result timing.
Concurrency: Inner subscriptions are queued sequentially.
Cancellation: New source values do not cancel the active inner Observable.
Termination: The result completes after the source, the queue, and the active inner complete; errors terminate the result.

Operator behavior: concatMapTo ignores the incoming value and runs the same inner Observable once per source value, sequentially.

exhaust — ignoreWhileBusy

Source: A higher-order Observable emits inner Observables.
Trigger: An outer next(inner$) is accepted only when no inner is active.
Value: The accepted inner Observable is flattened.
Cardinality: Only accepted inner Observables can produce output values.
Time: The accepted inner Observable defines output timing.
Concurrency: Only one inner Observable may be active.
Cancellation: New inner Observables are ignored while busy.
Termination: The result completes after the outer source and active inner complete; errors terminate the result.

Operator behavior: exhaust subscribes to the first inner Observable and ignores new inner Observables until the active one completes.

exhaustMap — transformIfNotBusy

Source: Each source value may create inner work.
Trigger: A source next(value) is accepted only when no inner Observable is active.
Value: Accepted values are mapped to inner Observables.
Cardinality: Accepted source values may produce many inner values.
Time: The active inner Observable defines output timing.
Concurrency: Only one inner Observable may be active.
Cancellation: New source values are ignored while busy and do not cancel the active inner.
Termination: The result completes after the source and active inner complete; errors terminate the result.

Operator behavior: exhaustMap starts inner work when idle and ignores new source values while that work is running.

expand — expandRecursively

Source: The original source values and generated values both feed the expansion process.
Trigger: Each emitted value triggers the recursive projection function.
Value: The value is mapped to another Observable whose values are also expanded.
Cardinality: One value can recursively produce many more values.
Time: Source and generated inner Observables define timing.
Concurrency: Recursive inner Observables may overlap according to the concurrency setting.
Cancellation: Unsubscribing cancels all active recursive work.
Termination: The result completes when the source and all recursive expansions complete; errors terminate the result.

Operator behavior: expand recursively grows the stream by feeding produced values back into the projection policy.

groupBy — groupInto

Source: Each source value carries or produces a grouping key.
Trigger: Every source next(value) computes or reads the key.
Value: The value is routed into a grouped Observable for that key.
Cardinality: One source value goes into one group, and each new key creates a grouped Observable.
Time: Groups are created and values are routed immediately.
Concurrency: Multiple grouped Observables can be active at the same time.
Cancellation: Group lifetimes may end by unsubscription or duration policy.
Termination: Groups complete when the source completes and error when the source errors.

Operator behavior: groupBy splits one stream into keyed substreams.

mapTo — replaceWith

Source: Each source value flows into the operator.
Trigger: Every source next(value) triggers replacement.
Value: The original value is replaced with a constant value.
Cardinality: One source value produces one constant result value.
Time: The constant value is emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: mapTo ignores each incoming value and emits the same replacement value each time.

mergeMap — transformConcurrently

Source: Each source value is used to create inner work.
Trigger: Every source next(value) calls the projection function.
Value: The source value is mapped to an inner Observable.
Cardinality: One source value may produce many inner values.
Time: Inner Observables define result timing.
Concurrency: Multiple inner Observables may run at the same time.
Cancellation: New source values do not cancel previous inner Observables.
Termination: The result completes after the source and all active inner Observables complete; errors terminate the result.

Operator behavior: mergeMap turns values into inner Observables and allows their work to overlap.

mergeMapTo — mergeInto

Source: Each source value triggers the same inner Observable.
Trigger: Every source next(value) requests the fixed inner Observable.
Value: The source value is replaced by the same inner Observable.
Cardinality: One source value may produce many inner values.
Time: The fixed inner Observable defines result timing.
Concurrency: Multiple inner subscriptions may run at the same time.
Cancellation: New source values do not cancel previous inner subscriptions.
Termination: The result completes after the source and all active inner subscriptions complete; errors terminate the result.

Operator behavior: mergeMapTo ignores the incoming value and concurrently subscribes to the same inner Observable for each source value.

mergeScan — accumulateConcurrently

Source: Each source value and the current accumulator state flow into the projection.
Trigger: Every source next(value) starts an accumulator projection.
Value: The accumulator function returns an inner Observable of new state values.
Cardinality: One source value may produce many state values.
Time: Inner state Observables define result timing.
Concurrency: Multiple accumulator inner Observables may overlap.
Cancellation: New source values do not cancel previous accumulator inner Observables.
Termination: The result completes after the source and all active accumulator Observables complete; errors terminate the result.

Operator behavior: mergeScan is state accumulation where each update can be asynchronous and overlapping.

pairwise — withPrevious

Source: Source values flow with memory of the previous value.
Trigger: Each source next(value) after the first triggers output.
Value: The previous and current values are paired.
Cardinality: Two adjacent source values produce one pair.
Time: The pair is emitted immediately when the current value arrives.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: pairwise emits [previous, current] for each value after the first.

pluck — pickProperty

Source: Each source value is expected to be an object or path-compatible value.
Trigger: Every source next(value) triggers property selection.
Value: The configured property or path is extracted.
Cardinality: One source object produces one selected property value.
Time: The selected value is emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: pluck extracts a property path from each emitted object.

scan — accumulate

Source: Each source value flows together with remembered accumulator state.
Trigger: Every source next(value) runs the accumulator function.
Value: The accumulator state is updated.
Cardinality: One source value produces one new state value.
Time: The new state is emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: scan turns a stream of values into a stream of remembered state over time.

switchScan — accumulateSwitching

Source: Each source value and current state feed an asynchronous accumulator.
Trigger: Every source next(value) starts a new accumulator inner Observable.
Value: The accumulator projection maps state and value to an inner Observable of state.
Cardinality: One source value may produce many state values.
Time: The latest accumulator inner Observable defines result timing.
Concurrency: Only the latest accumulator inner Observable is active.
Cancellation: A new source value cancels the previous accumulator inner Observable.
Termination: The result completes after the source and latest inner complete; errors terminate the result.

Operator behavior: switchScan accumulates state asynchronously, but only the latest state-producing inner Observable remains active.

switchMap — transformSwitching

Source: Each source value is used to create inner work.
Trigger: Every source next(value) calls the projection function.
Value: The source value is mapped to an inner Observable.
Cardinality: One source value may produce many inner values.
Time: The latest inner Observable defines output timing.
Concurrency: Only the latest inner Observable is active.
Cancellation: A new source value cancels the previous inner Observable subscription.
Termination: The result completes after the source and latest active inner complete; errors terminate the result.

Operator behavior: switchMap starts new inner work for each source value and cancels the previous work so only the latest inner Observable can emit.

switchMapTo — switchTo

Source: Each source value triggers the same inner Observable.
Trigger: Every source next(value) requests the fixed inner Observable.
Value: The source value is replaced by the same inner Observable.
Cardinality: One source value may produce many inner values.
Time: The latest inner Observable subscription defines output timing.
Concurrency: Only the latest inner subscription is active.
Cancellation: A new source value cancels the previous inner subscription.
Termination: The result completes after the source and latest inner complete; errors terminate the result.

Operator behavior: switchMapTo ignores the source value and switches to a new subscription of the same inner Observable each time.

Window operators
window — windowUntilSignal

Source: One source Observable provides values, and a closing notifier provides window boundaries.
Trigger: The closing notifier emits.
Value: Source values are routed into an inner Observable window.
Cardinality: Many source values become one inner Observable window.
Time: Window boundaries are controlled by the notifier.
Concurrency: Usually one window is active at a time.
Cancellation: Unsubscribing closes the active window.
Termination: The active window closes when the source completes, and errors are forwarded.

Operator behavior: window groups values into inner Observables instead of arrays.

windowCount — windowOfN

Source: One source Observable provides values.
Trigger: The window reaches the configured count.
Value: Source values are routed into an inner Observable window.
Cardinality: N source values form one window.
Time: Windowing is count-based, not clock-based.
Concurrency: Windows may overlap depending on configuration.
Cancellation: Unsubscribing closes active windows.
Termination: Active windows close on source completion, and errors are forwarded.

Operator behavior: windowCount creates inner Observable windows based on value count.

windowTime — windowForDuration

Source: One source Observable provides values over time.
Trigger: A fixed time window closes.
Value: Source values are routed into an inner Observable window.
Cardinality: Many values in a time range become one window Observable.
Time: Fixed-duration timers control windows.
Concurrency: Windows may overlap depending on configuration.
Cancellation: Unsubscribing closes active windows and cancels timers.
Termination: Active windows close on source completion, and errors are forwarded.

Operator behavior: windowTime creates inner Observable windows over fixed time intervals.

windowToggle — windowBetweenSignals

Source: One source Observable provides values, one signal opens windows, and another signal closes them.
Trigger: An opening signal starts a window, and a closing signal closes it.
Value: Source values are routed into windows between open and close signals.
Cardinality: Many values in an open-close interval become one inner Observable window.
Time: Signal Observables control window lifetime.
Concurrency: Multiple windows may overlap.
Cancellation: Unsubscribing closes active windows.
Termination: Active windows close on source completion, and errors are forwarded.

Operator behavior: windowToggle creates inner Observable windows between explicit opening and closing signals.

windowWhen — windowUntilFactory

Source: One source Observable provides values, and a closing selector creates dynamic boundaries.
Trigger: The current closing signal emits.
Value: Source values are routed into the active inner Observable window.
Cardinality: Many values per dynamic boundary become one window Observable.
Time: Dynamic closing Observables control window timing.
Concurrency: Usually one window is active at a time.
Cancellation: Unsubscribing cancels the active closing signal and closes the active window.
Termination: The active window closes on source completion, and errors are forwarded.

Operator behavior: windowWhen repeatedly opens a window and closes it when a dynamically created boundary fires.

Filtering and timing operators
audit — emitLatestAfterSignal

Source: Source values arrive while a duration selector creates audit windows.
Trigger: The first source value opens an audit window, and the duration signal closes it.
Value: The latest suppressed source value is emitted when the window closes.
Cardinality: Many source values in one audit window become at most one output value.
Time: The duration signal controls the audit window.
Concurrency: Only one audit window is active at a time.
Cancellation: Older suppressed values are replaced by newer suppressed values.
Termination: Errors are forwarded, and completion waits for the active audit behavior to settle.

Operator behavior: audit ignores values during a signal-controlled window and emits the latest remembered value when the window closes.

auditTime — emitLatestAfterDelay

Source: Source values arrive over time.
Trigger: The first source value opens a fixed audit window.
Value: The latest suppressed value is emitted when the fixed duration ends.
Cardinality: Many source values in one audit window become at most one output value.
Time: A fixed duration controls the audit window.
Concurrency: Only one audit window is active at a time.
Cancellation: Older suppressed values are replaced by newer suppressed values.
Termination: Errors are forwarded, and completion waits for active audit timing to settle.

Operator behavior: auditTime samples the latest value after each fixed cooldown window.

debounce — afterSilence

Source: Source values arrive over time.
Trigger: A per-value duration signal must complete or emit before another source value arrives.
Value: The pending value is emitted only if it survives the silence period.
Cardinality: Many rapid source values collapse to the latest surviving value.
Time: The silence duration is controlled by a per-value signal Observable.
Concurrency: Only the latest pending value matters.
Cancellation: A new source value cancels the previous pending emission.
Termination: Errors are forwarded, and completion emits the pending value if its debounce condition is satisfied.

Operator behavior: debounce waits for dynamic silence and emits only the latest value that was not replaced.

debounceTime — afterSilenceOf

Source: Source values arrive over time.
Trigger: A fixed silence duration must pass after a source value.
Value: The pending source value is emitted after silence.
Cardinality: Many rapid source values collapse to the latest surviving value.
Time: A fixed duration controls silence.
Concurrency: Only the latest pending value matters.
Cancellation: A new source value cancels the previous pending emission.
Termination: Errors are forwarded, and completion emits the pending value if appropriate.

Operator behavior: debounceTime emits a value only after the source has stopped changing for a fixed time.

distinct — uniqueValues

Source: Each source value flows with memory of previously seen values.
Trigger: Every source next(value) checks the seen-value store.
Value: Only values not seen before are kept.
Cardinality: The result is a subset of source values.
Time: Kept values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: distinct emits only globally new values across the stream history.

distinctUntilChanged — skipDuplicates

Source: Each source value flows with memory of the previous value.
Trigger: Every source next(value) compares current with previous.
Value: Only values different from the immediately previous value are kept.
Cardinality: The result is a subset of source values.
Time: Kept values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: distinctUntilChanged removes only consecutive duplicates.

distinctUntilKeyChanged — skipDuplicatesBy

Source: Each source object flows with memory of the previous selected key value.
Trigger: Every source next(value) compares the selected key.
Value: Values are kept only when the selected key changed.
Cardinality: The result is a subset of source values.
Time: Kept values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: distinctUntilKeyChanged removes consecutive duplicates by a selected object key.

elementAt — atIndex

Source: Source values are treated as indexed emissions.
Trigger: The requested index arrives.
Value: Only the value at the requested index is emitted.
Cardinality: Many source values produce at most one selected value.
Time: The selected value is emitted when its index is reached.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled after the selected value is found.
Termination: The result completes after the selected value or errors/defaults if the index is missing.

Operator behavior: elementAt selects exactly one emission by index.

first — takeFirst

Source: Source values are searched from the beginning.
Trigger: The first value, or first matching value, arrives.
Value: That first matching value is emitted.
Cardinality: Many source values produce one selected value.
Time: Output happens immediately at the first match.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled after the first match.
Termination: The result completes after the first match or errors/defaults if no match exists.

Operator behavior: first emits the first acceptable value and then stops the stream.

ignoreElements — suppressValues

Source: Source next, error, and complete notifications flow into the operator.
Trigger: Every source notification is observed.
Value: All next values are dropped.
Cardinality: Many source values become zero output values.
Time: Error and completion timing is preserved.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: ignoreElements silences values but keeps the stream’s error and completion protocol.

last — takeLast

Source: Source values are remembered until completion.
Trigger: Source completion triggers final selection.
Value: The last value, or last matching value, is emitted.
Cardinality: Many source values produce one final value.
Time: Output happens only when the source completes.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The result completes after emitting the last value or errors/defaults if no match exists.

Operator behavior: last waits until completion and emits the final acceptable value.

sample — snapshotOn

Source: One source Observable provides values, and a sampler Observable provides snapshot signals.
Trigger: The sampler emits.
Value: The latest remembered source value is emitted.
Cardinality: Many source values become at most one output per sampler signal.
Time: The sampler controls output timing.
Concurrency: Source and sampler are subscribed concurrently.
Cancellation: Source values are not cancelled; only the latest is remembered.
Termination: The result completes with the source and errors if source or sampler errors.

Operator behavior: sample takes a snapshot of the latest source value whenever another stream says “now.”

sampleTime — snapshotEvery

Source: One source Observable provides values over time.
Trigger: A periodic timer ticks.
Value: The latest remembered source value is emitted.
Cardinality: Many source values become at most one output per timer tick.
Time: A fixed interval controls output timing.
Concurrency: The source and timer run concurrently.
Cancellation: Source values are not cancelled; only the latest is remembered.
Termination: Source error and completion are forwarded.

Operator behavior: sampleTime periodically emits the latest known source value.

single — exactlyOne

Source: Source values are checked against an optional predicate.
Trigger: Matching values are counted until completion or until a second match appears.
Value: The one matching value is emitted.
Cardinality: Many source values must produce exactly one result value.
Time: Output usually happens at completion, unless an error is known earlier.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled early if more than one match is found.
Termination: The result completes after the single match or errors if there are zero or multiple matches.

Operator behavior: single requires exactly one matching value and treats zero or multiple matches as failure.

skip — dropFirst

Source: Source values are counted from the beginning.
Trigger: Every source next(value) increments the count.
Value: The first N values are dropped, and later values are forwarded.
Cardinality: The result is the source minus its first N values.
Time: Values after the skipped prefix are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: skip ignores the first N values and then lets the rest through.

skipLast — dropLast

Source: Source values flow through a trailing buffer.
Trigger: A source value is emitted only when enough later values have arrived.
Value: Values are delayed through a buffer so the final N can be dropped.
Cardinality: The result is the source minus its last N values.
Time: Output is delayed by the trailing buffer.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The buffered last N values are dropped on completion, and errors are forwarded.

Operator behavior: skipLast forwards all values except the final N, which can only be known at completion.

skipUntil — startAfterSignal

Source: One source Observable provides values, and one notifier provides a start signal.
Trigger: The start signal emits.
Value: Values before the signal are dropped, and values after the signal are forwarded.
Cardinality: The result is the suffix of the source after the signal.
Time: The notifier controls when forwarding begins.
Concurrency: Source and notifier are subscribed concurrently.
Cancellation: The notifier is unsubscribed after it starts the stream.
Termination: Source error and completion are forwarded.

Operator behavior: skipUntil ignores the source until another stream says “start now.”

skipWhile — dropWhile

Source: Source values are checked in order.
Trigger: Every source value checks the predicate until the predicate becomes false.
Value: Values are dropped while the predicate is true, then all later values are forwarded.
Cardinality: The result is the source suffix after the predicate first fails.
Time: Forwarded values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: skipWhile drops the initial prefix while a condition holds, then stops testing and passes everything through.

take — limitTo

Source: Source values are counted from the beginning.
Trigger: Each source next(value) is forwarded until N values have been taken.
Value: The first N values are kept.
Cardinality: The result has at most N values.
Time: Taken values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled after the Nth value.
Termination: The result completes after N values or when the source completes earlier.

Operator behavior: take keeps the first N values and then completes early.

takeLast — lastN

Source: Source values are stored in a trailing buffer.
Trigger: Source completion triggers output.
Value: The final N values are emitted.
Cardinality: Many source values produce at most N final values.
Time: Output happens only on completion.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The result emits the buffer and completes, or errors if the source errors.

Operator behavior: takeLast waits for completion, then emits the final N values.

takeUntil — stopWhen

Source: One source Observable provides values, and one notifier provides a stop signal.
Trigger: The stop signal emits.
Value: Source values are forwarded until the stop signal.
Cardinality: The result is the source prefix before the signal.
Time: The notifier controls when forwarding stops.
Concurrency: Source and notifier are subscribed concurrently.
Cancellation: The source is cancelled when the stop signal emits.
Termination: The result completes on the stop signal or source completion, and errors if source or notifier errors.

Operator behavior: takeUntil lets values through until another stream says “stop now.”

takeWhile — stopWhenNot

Source: Source values are checked in order.
Trigger: Every source value checks the predicate.
Value: Values are forwarded while the predicate is true.
Cardinality: The result is the source prefix while the condition holds.
Time: Forwarded values are emitted immediately.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled when the predicate becomes false.
Termination: The result completes when the predicate fails or when the source completes.

Operator behavior: takeWhile keeps values while a condition holds and completes when the condition fails.

throttle — limitRate

Source: Source values arrive over time, and a duration selector defines suppression windows.
Trigger: The first allowed source value starts a throttle window.
Value: The allowed value is emitted, and later values are suppressed during the window.
Cardinality: Many rapid source values become at most one value per throttle window.
Time: The duration signal controls the throttle window.
Concurrency: One throttle window is active at a time.
Cancellation: Suppressed values during the active window are dropped.
Termination: Source error and completion are forwarded.

Operator behavior: throttle emits a value, then ignores values until the configured duration signal allows the next one.

throttleTime — limitRateTo

Source: Source values arrive over time.
Trigger: The first allowed source value starts a fixed throttle window.
Value: The allowed value is emitted, and later values are suppressed during the fixed duration.
Cardinality: Many rapid source values become at most one value per time window.
Time: A fixed duration controls the throttle window.
Concurrency: One throttle window is active at a time.
Cancellation: Suppressed values during the active window are dropped.
Termination: Source error and completion are forwarded.

Operator behavior: throttleTime emits one value, then blocks further values for a fixed time.

Higher-order join operators
combineLatestAll — combineAllLatest

Source: A higher-order Observable emits inner Observables.
Trigger: After the outer source completes, inner latest-combination behavior begins.
Value: Latest values from all collected inner Observables are combined.
Cardinality: Many inner streams produce one combined output stream.
Time: Output timing is controlled by inner emissions after all inners have emitted.
Concurrency: Collected inner Observables are subscribed concurrently.
Cancellation: Unsubscribing cancels all active inner subscriptions.
Termination: The result completes when all inner Observables complete and errors when outer or inner errors.

Operator behavior: combineLatestAll waits for the outer stream of inner streams to finish, then combines the latest values from the collected inner streams.

concatAll — joinSequentially

Source: A higher-order Observable emits inner Observables.
Trigger: An inner Observable is subscribed when the previous inner completes.
Value: Inner values are forwarded sequentially.
Cardinality: Many inner streams become one output stream.
Time: Each active inner Observable controls timing while it is active.
Concurrency: Only one inner Observable is active at a time.
Cancellation: New inner Observables do not cancel the active inner; they wait.
Termination: The result completes after the outer source and all queued inner Observables complete; errors terminate the result.

Operator behavior: concatAll flattens inner Observables one at a time in order.

exhaustAll — joinIfNotBusy

Source: A higher-order Observable emits inner Observables.
Trigger: An outer next(inner$) is accepted only when idle.
Value: Accepted inner values are forwarded.
Cardinality: Only accepted inner Observables produce output.
Time: The active inner Observable controls output timing.
Concurrency: Only one inner Observable is active.
Cancellation: New inner Observables are ignored while busy.
Termination: The result completes after the outer source and active inner complete; errors terminate the result.

Operator behavior: exhaustAll flattens the first inner Observable and ignores later inners while it is active.

mergeAll — joinConcurrently

Source: A higher-order Observable emits inner Observables.
Trigger: Every outer next(inner$) subscribes to that inner Observable.
Value: Values from all active inner Observables are forwarded.
Cardinality: Many inner streams become one interleaved output stream.
Time: Each inner Observable controls the timing of its own values.
Concurrency: Multiple inner Observables may be active at the same time.
Cancellation: New inner Observables do not cancel previous inner Observables.
Termination: The result completes after the outer source and all active inner Observables complete; errors terminate the result.

Operator behavior: mergeAll flattens inner Observables concurrently.

switchAll — joinSwitching

Source: A higher-order Observable emits inner Observables.
Trigger: Every outer next(inner$) switches to that latest inner Observable.
Value: Only values from the latest inner Observable are forwarded.
Cardinality: Many inner streams become one latest-only output stream.
Time: The latest inner Observable controls output timing.
Concurrency: Only the latest inner Observable is active.
Cancellation: A new inner Observable cancels the previous inner subscription.
Termination: The result completes after the outer source and latest inner complete; errors terminate the result.

Operator behavior: switchAll always listens to the latest inner Observable and cancels the previous one.

startWith — prependWith

Source: Initial values are placed before the source Observable.
Trigger: Subscription triggers the initial emissions before the source starts emitting.
Value: Initial values are prepended to the source values.
Cardinality: The result contains initial values plus source values.
Time: Initial values emit first, then source timing takes over.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded after initial values.

Operator behavior: startWith gives a stream one or more initial values before normal source values arrive.

withLatestFrom — pairWithLatest

Source: One primary source Observable combines with secondary Observables.
Trigger: Only the primary source emitting triggers output.
Value: The primary value is paired with the latest secondary values.
Cardinality: One primary value produces one combined value if all secondaries have latest values.
Time: Output timing is controlled by the primary source.
Concurrency: Primary and secondary Observables are subscribed concurrently.
Cancellation: Secondary values are not cancelled; only their latest values are remembered.
Termination: The result completes when the primary source completes and errors when any input errors.

Operator behavior: withLatestFrom lets the primary stream decide when to emit, while attaching latest context from other streams.

Multicasting operators
multicast — shareVia

Source: One cold source Observable is routed through a Subject or Subject factory.
Trigger: Connection or subscription starts the shared source depending on usage.
Value: Source notifications are sent through the Subject.
Cardinality: One source subscription feeds many subscribers.
Time: Subscribers observe the shared source timing through the Subject.
Concurrency: One producer is shared by multiple observers.
Cancellation: Disconnecting unsubscribes from the shared source.
Termination: The Subject forwards source error and completion.

Operator behavior: multicast shares one source subscription through a Subject.

publish — makeHot

Source: One cold source Observable is converted into a connectable Observable.
Trigger: Calling connect starts the shared source subscription.
Value: Source notifications are shared through a plain Subject.
Cardinality: One source subscription feeds many subscribers.
Time: Values begin after explicit connection.
Concurrency: One producer is shared by multiple observers.
Cancellation: Disconnecting cancels the shared source subscription.
Termination: Source error and completion are forwarded to subscribers.

Operator behavior: publish makes a source explicitly connectable and shared.

publishBehavior — makeHotWithLatest

Source: One cold source Observable is shared through a BehaviorSubject.
Trigger: Connection starts the source, and late subscription receives the current value.
Value: The current/latest value is replayed to new subscribers.
Cardinality: One source subscription feeds many subscribers with a current value.
Time: New subscribers receive the current value immediately, then source timing continues.
Concurrency: One producer is shared by multiple observers.
Cancellation: Disconnecting cancels the shared source subscription.
Termination: Source error and completion are forwarded.

Operator behavior: publishBehavior shares a source and gives subscribers the latest/current value through BehaviorSubject behavior.

publishLast — makeHotWithLastValue

Source: One cold source Observable is shared through an AsyncSubject.
Trigger: Source completion triggers final value delivery.
Value: Only the last source value is emitted to subscribers.
Cardinality: Many source values become one final shared value.
Time: Output happens only on completion.
Concurrency: One producer is shared by multiple observers.
Cancellation: Disconnecting cancels the shared source subscription.
Termination: The last value is emitted on completion, or error is forwarded.

Operator behavior: publishLast shares a source but only releases the final value when the source completes.

publishReplay — makeHotWithReplay

Source: One cold source Observable is shared through a ReplaySubject.
Trigger: Connection starts the source, and late subscription receives replayed values.
Value: Buffered past values are replayed to new subscribers.
Cardinality: One source subscription feeds many subscribers with replay.
Time: Replay happens immediately on subscription, then source timing continues.
Concurrency: One producer is shared by multiple observers.
Cancellation: Disconnecting cancels the shared source subscription.
Termination: Source error and completion are forwarded and may be replayed.

Operator behavior: publishReplay shares a source and replays buffered history to later subscribers.

share — shareAmong

Source: One cold source Observable is shared among subscribers.
Trigger: The first subscriber starts the source subscription.
Value: Source notifications are multicast to current subscribers.
Cardinality: One source subscription feeds many subscribers.
Time: Subscribers share the same source timing while subscribed.
Concurrency: One producer is shared by multiple observers.
Cancellation: The source is unsubscribed when the subscriber count drops to zero, depending on configuration.
Termination: Error, completion, and reset behavior follow the share configuration.

Operator behavior: share turns a cold source into a shared source while subscribers are present.

Error handling operators
catchError — handleError

Source: One source Observable may emit values or error.
Trigger: A source error activates the recovery function.
Value: The error is replaced by a recovery Observable or rethrown.
Cardinality: One error may become many recovery values or another error.
Time: The recovery Observable defines timing after the error.
Concurrency: Recovery starts after the source has failed.
Cancellation: Unsubscribing cancels the recovery Observable.
Termination: The result continues with recovery or terminates if the error is rethrown.

Operator behavior: catchError turns a stream failure into a replacement stream.

retry — tryAgain

Source: One source Observable may fail.
Trigger: A source error triggers resubscription if retry limits allow it.
Value: The same source execution is attempted again.
Cardinality: Values may be emitted from multiple attempts.
Time: Retry timing is immediate or configured.
Concurrency: Only one attempt runs at a time.
Cancellation: Unsubscribing cancels the current attempt and prevents future retries.
Termination: The result completes when an attempt completes or errors when retries are exhausted.

Operator behavior: retry resubscribes to the source after errors according to a retry policy.

retryWhen — retryWhenSignaled

Source: One source Observable may fail, and a notifier controls retries.
Trigger: A source error is passed to the notifier, and notifier emission triggers retry.
Value: The same source execution is attempted again.
Cardinality: Values may be emitted from multiple attempts.
Time: The notifier controls retry timing.
Concurrency: Only one source attempt runs at a time.
Cancellation: Unsubscribing cancels the attempt and notifier subscription.
Termination: The result completes when the source completes or errors when the notifier/errors policy terminates.

Operator behavior: retryWhen retries the source when another stream says retry is allowed.

Utility operators
tap — sideEffect

Source: Source next, error, and complete notifications pass through the operator.
Trigger: Each observed notification triggers the side-effect handler.
Value: The original value is forwarded unchanged.
Cardinality: One input notification produces one output notification unless the side effect throws.
Time: Side effects happen immediately during notification delivery.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Original error and completion are forwarded, unless the side effect throws an error.

Operator behavior: tap observes the stream for side effects without changing the values.

delay — delayBy

Source: Source values and completion flow into scheduler-based delay.
Trigger: Each source value schedules a later emission.
Value: The same value is forwarded later.
Cardinality: One source value produces one delayed value.
Time: A fixed delay shifts value delivery forward.
Concurrency: Scheduled timers may overlap.
Cancellation: Unsubscribing cancels scheduled values.
Termination: Completion is delayed until scheduled values flush, while errors are forwarded according to RxJS delay behavior.

Operator behavior: delay shifts value emissions later in time without changing the values.

delayWhen — delayUntilSignal

Source: Each source value gets its own delay signal.
Trigger: The per-value delay signal emits or completes.
Value: The original value is forwarded after its delay signal.
Cardinality: One source value produces one delayed value.
Time: Each value has signal-controlled timing.
Concurrency: Multiple delay signals may be active at the same time.
Cancellation: Unsubscribing cancels pending delayed values.
Termination: The result completes after the source and pending delays complete, and errors are forwarded.

Operator behavior: delayWhen delays each value until its own Observable signal allows it through.

dematerialize — unwrapNotification

Source: The source emits Notification objects as ordinary values.
Trigger: Each Notification value is read.
Value: Notification values are converted back into next, error, or complete protocol events.
Cardinality: One Notification value becomes one stream protocol event.
Time: Conversion happens immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Error and complete Notification values terminate the result stream.

Operator behavior: dematerialize turns Notification values back into real Observable events.

materialize — wrapAsNotification

Source: Source next, error, and complete protocol events flow into the operator.
Trigger: Every source protocol event is observed.
Value: Each protocol event is wrapped as a Notification object.
Cardinality: One protocol event becomes one Notification value.
Time: Wrapping happens immediately.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: After wrapping error or completion as a value, the result completes.

Operator behavior: materialize turns next, error, and complete into ordinary inspectable values.

observeOn — scheduleOn

Source: Source notifications flow into a scheduler boundary.
Trigger: Each source notification is scheduled for later delivery.
Value: The notification itself is not changed.
Cardinality: One input notification produces one scheduled output notification.
Time: The scheduler controls delivery timing.
Concurrency: The scheduler queue controls ordering and delivery context.
Cancellation: Unsubscribing cancels scheduled notifications not yet delivered.
Termination: Error and completion are delivered through the scheduler.

Operator behavior: observeOn changes where and when notifications are delivered, not what values mean.

subscribeOn — subscribeUsing

Source: The source subscription side effect is scheduled.
Trigger: A downstream subscriber subscribes.
Value: Source values are forwarded unchanged.
Cardinality: The result has the same value cardinality as the source.
Time: The scheduler controls when subscription starts.
Concurrency: The scheduler controls producer startup context.
Cancellation: Unsubscribing can cancel a scheduled subscription or active subscription.
Termination: Source error and completion are forwarded.

Operator behavior: subscribeOn changes when and where the source subscription starts.

timeInterval — withTimeInterval

Source: Source values flow with access to scheduler time.
Trigger: Every source next(value) measures elapsed time since the previous emission.
Value: The value is wrapped with an interval measurement.
Cardinality: One source value produces one timed object.
Time: Scheduler time is used for measurement.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: timeInterval attaches the time gap since the previous emission to each value.

timestamp — withTimestamp

Source: Source values flow with access to scheduler time.
Trigger: Every source next(value) reads the current timestamp.
Value: The value is wrapped with the timestamp.
Cardinality: One source value produces one timestamped object.
Time: Scheduler time is used for the timestamp.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: Source error and completion are forwarded.

Operator behavior: timestamp attaches the current time to each emitted value.

timeout — failAfter

Source: One source Observable is watched by a deadline policy.
Trigger: The deadline fires before the required source emission.
Value: A timeout error is raised.
Cardinality: Source values pass through until a timeout error occurs.
Time: A configured deadline controls failure timing.
Concurrency: The source and timeout timer run concurrently.
Cancellation: The timer is reset or cancelled according to the timeout configuration.
Termination: The result errors on timeout or follows source error and completion.

Operator behavior: timeout fails the stream if the source is too slow.

timeoutWith — fallbackAfter

Source: One source Observable is watched by a deadline policy and has a fallback Observable.
Trigger: The deadline fires before the required source emission.
Value: The source is replaced by the fallback Observable.
Cardinality: Source values pass through until timeout; after timeout, fallback values may emit.
Time: Deadline timing controls the switch, then fallback timing controls output.
Concurrency: The source and timer run concurrently until timeout.
Cancellation: The source is cancelled when fallback takes over.
Termination: The result follows source termination before timeout or fallback termination after timeout.

Operator behavior: timeoutWith switches to a fallback stream if the source is too slow.

toArray — collectAll

Source: All source values are collected.
Trigger: Source completion triggers output.
Value: Collected values are emitted as one array.
Cardinality: Many source values become one array value.
Time: Output happens only on completion.
Concurrency: No inner Observable is created.
Cancellation: Unsubscribing drops the collected values.
Termination: The result emits the array and completes, or errors if the source errors.

Operator behavior: toArray waits until the source completes, then emits all collected values as a single array.

Conditional and boolean operators
defaultIfEmpty — orDefault

Source: One source Observable may emit zero or more values.
Trigger: Source completion checks whether any value was emitted.
Value: A default value is emitted if the source was empty.
Cardinality: Zero source values become one default value; non-empty sources pass through.
Time: The default case happens on completion.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The result completes after the default or normal source completion, and errors if the source errors.

Operator behavior: defaultIfEmpty turns an empty completed stream into a stream with one fallback value.

every — allMatch

Source: Source values are checked against a predicate.
Trigger: Every source value checks the predicate until failure or completion.
Value: A boolean result is produced.
Cardinality: Many source values produce one boolean value.
Time: false may emit early; true emits only on completion.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled early when the predicate fails.
Termination: The result emits the boolean and completes, or errors if the source errors.

Operator behavior: every checks whether all source values satisfy a predicate.

find — firstMatch

Source: Source values are searched with a predicate.
Trigger: The first matching value or source completion decides the result.
Value: The first matching value is emitted.
Cardinality: Many source values produce one optional result value.
Time: A match emits immediately; no match resolves on completion.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled after the first match.
Termination: The result completes after emitting the match or completing without one, and errors if the source errors.

Operator behavior: find emits the first value that satisfies a predicate.

findIndex — firstMatchIndex

Source: Indexed source values are searched with a predicate.
Trigger: The first matching value or source completion decides the result.
Value: The index of the first matching value is emitted.
Cardinality: Many source values produce one index value.
Time: A matching index emits immediately; no match resolves on completion.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled after the first match.
Termination: The result completes after emitting the index or no-match result, and errors if the source errors.

Operator behavior: findIndex emits the index of the first value that satisfies a predicate.

isEmpty — hasNoValues

Source: One source Observable may emit zero or more values.
Trigger: The first source value or source completion decides the result.
Value: false is emitted if a value appears, and true is emitted if completion happens first.
Cardinality: Many possible source values produce one boolean value.
Time: false can emit immediately on the first value; true emits on empty completion.
Concurrency: No inner Observable is created.
Cancellation: The source is cancelled after the first value.
Termination: The result emits the boolean and completes, or errors if the source errors.

Operator behavior: isEmpty tells whether the source completed without emitting any value.

Mathematical and aggregate operators
count — countValues

Source: Source values are counted.
Trigger: Source completion triggers the count result.
Value: The count is emitted as a number.
Cardinality: Many source values produce one number.
Time: Output happens only on completion.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The result emits the count and completes, or errors if the source errors.

Operator behavior: count waits for completion and emits how many values passed through.

max — maximum

Source: Comparable source values are observed.
Trigger: Source completion triggers the maximum result.
Value: The largest remembered value is emitted.
Cardinality: Many source values produce one maximum value.
Time: Output happens only on completion.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The result emits the maximum and completes, or errors if the source errors.

Operator behavior: max waits for completion and emits the largest value.

min — minimum

Source: Comparable source values are observed.
Trigger: Source completion triggers the minimum result.
Value: The smallest remembered value is emitted.
Cardinality: Many source values produce one minimum value.
Time: Output happens only on completion.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The result emits the minimum and completes, or errors if the source errors.

Operator behavior: min waits for completion and emits the smallest value.

reduce — foldInto

Source: Source values flow through an accumulator.
Trigger: Every source value updates the accumulator, and source completion triggers output.
Value: The accumulator function builds one final result.
Cardinality: Many source values produce one final accumulated value.
Time: Output happens only on completion.
Concurrency: No inner Observable is created.
Cancellation: No inner work exists to cancel.
Termination: The result emits the final accumulator and completes, or errors if the source errors.

Operator behavior: reduce folds all source values into one final result and emits only when the source completes.




This gives the standard RxJS user the full benefit: every operator becomes a small runtime story about what flows, what triggers, what changes, what is remembered, what waits, what overlaps, what gets cancelled, and how the Observable terminates.

following your 8 policies Framework for naming an operator and split the polcies back to english we got perfect Operator Behavior descriptions, that are far more accurate than any Rxjs operator behavior description I have read so far, this is the Rxjs Standard Operator Description
Updated memory
Thought for 11s

Yes — for your project, this is the right formulation:

RxJS Standard Operator Description
An operator behavior description generated from the 8 Policy Framework:

Source → Trigger → Value → Cardinality → Time → Concurrency → Cancellation → Termination

This is stronger than ordinary operator descriptions because it does not only say what the operator is “for.” It explains what the operator does to a running Observable.

The breakthrough

We now have a repeatable method:

1. Take an RxJS operator.
2. Describe it in strict 8-policy order.
3. Write the policy fragments as a long custom name.
4. Split the custom name back into English.
5. The result is the operator behavior story.

So the long name is not a gimmick. It is a compressed behavior description.

Example: switchMap

8-policy name:

SourceEachSourceValue-
TriggerOnSourceNext-
ValueMapToInnerObservable-
CardinalityOneSourceNextToManyInnerNexts-
TimeLatestInnerDefinesEmissionTime-
ConcurrencyOnlyLatestInnerActive-
CancellationCancelPreviousInnerOnNewSourceNext-
TerminationCompleteAfterSourceAndLatestInnerCompleteErrorWhenSourceOrInnerErrors

Operator story:

Each source value flows into the operator.
Each source next notification triggers the projection function.
The value is mapped to an inner Observable.
One source value may produce many inner values.
The latest inner Observable defines the emission time.
Only the latest inner Observable is active.
A new source value cancels the previous inner Observable subscription.
The result completes after the source and latest inner complete, and errors if the source or inner errors.

That is much more precise than simply saying:

switchMap maps to an Observable and switches to the latest one.
The standard description format

I would now define each operator entry like this:

Operator: switchMap
Practical name: keepLatest

8-policy name:
SourceEachSourceValue-
TriggerOnSourceNext-
ValueMapToInnerObservable-
CardinalityOneSourceNextToManyInnerNexts-
TimeLatestInnerDefinesEmissionTime-
ConcurrencyOnlyLatestInnerActive-
CancellationCancelPreviousInnerOnNewSourceNext-
TerminationCompleteAfterSourceAndLatestInnerCompleteErrorWhenSourceOrInnerErrors

Operator behavior story:
Each source value starts new inner work.
The new inner Observable becomes the only active inner Observable.
The previous inner Observable is cancelled.
Only the latest inner Observable may emit to the result.
The result completes after the source and latest inner complete.
Errors from the source or inner Observable terminate the result unless recovered.
Final formulation

The RxJS Standard Operator Description is the operator behavior story generated from the 8 policies.

Or even stronger:

An RxJS operator is fully described when we can say what it does to Source, Trigger, Value, Cardinality, Time, Concurrency, Cancellation, and Termination.

This gives your RxJS Vocabulary project a real standard: not just better names, but precise, repeatable, readable operator behavior descriptions.

# RxJS Operator Stories from the 8 Policy Framework

## Reading template

Every operator story follows the same order:

```txt
Source → Trigger → Value → Cardinality → Time → Concurrency → Cancellation → Termination
```

Then the final line gives the practical operator behavior.

---

# Core value operators

## `map` — `transformWith`

**Source:** Each source value flows into the operator.
**Trigger:** Every source `next(value)` activates the projection function.
**Value:** The projection function transforms the value.
**Cardinality:** One source value produces one result value.
**Time:** The result is emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `map` rewrites each value as it passes through, without changing timing, sharing, cancellation, error, or completion behavior.

---

## `filter` — `keepIf`

**Source:** Each source value flows into the predicate.
**Trigger:** Every source `next(value)` checks the predicate.
**Value:** Values that satisfy the predicate are kept.
**Cardinality:** One source value produces either one result value or no result value.
**Time:** Kept values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `filter` lets only matching values continue through the stream.

---

# Join creation operators

## `combineLatest` — `latestFromAll`

**Source:** Multiple input Observables flow into one combined stream.
**Trigger:** After every input has emitted once, any new input value triggers output.
**Value:** The latest value from each input is combined into one tuple or array.
**Cardinality:** Many source streams produce one combined output stream.
**Time:** Output timing is controlled by whichever input emits next.
**Concurrency:** All input Observables are subscribed concurrently.
**Cancellation:** Unsubscribing cancels all input subscriptions.
**Termination:** The result completes when all inputs complete and errors when any input errors.

**Operator behavior:** `combineLatest` keeps the latest value from every source and emits a new combined snapshot whenever any source changes.

---

## `concat` — `runInSequence`

**Source:** Multiple input Observables are arranged in sequence.
**Trigger:** The first Observable starts immediately, and the next starts only after the current one completes.
**Value:** Values are forwarded from the currently active Observable.
**Cardinality:** Many source streams become one sequential output stream.
**Time:** Timing is controlled by one source Observable at a time.
**Concurrency:** Only one input Observable is subscribed at a time.
**Cancellation:** Unsubscribing cancels the current active source and prevents later sources from starting.
**Termination:** The result completes after all sources complete, and errors if the active source errors.

**Operator behavior:** `concat` runs streams one after another, preserving source order and waiting for completion before moving on.

---

## `forkJoin` — `waitForAll`

**Source:** Multiple input Observables are observed together.
**Trigger:** Output happens only when all inputs complete.
**Value:** The last value from each input is collected.
**Cardinality:** Many source streams produce one final combined value.
**Time:** Output happens only at completion time.
**Concurrency:** All input Observables are subscribed concurrently.
**Cancellation:** Unsubscribing cancels all input subscriptions.
**Termination:** The result emits once and completes after all inputs complete; it errors if any input errors.

**Operator behavior:** `forkJoin` waits for all streams to finish, then emits their final values as one result.

---

## `merge` — `mergeAll` in uploaded list

**Source:** Multiple input Observables flow into one output stream.
**Trigger:** Any input `next(value)` triggers an output value.
**Value:** Values are forwarded unchanged from whichever source emits.
**Cardinality:** Many source streams become one interleaved output stream.
**Time:** Each value keeps the timing of its original source.
**Concurrency:** All input Observables are subscribed concurrently.
**Cancellation:** Unsubscribing cancels all input subscriptions.
**Termination:** The result completes when all inputs complete and errors when any input errors.

**Operator behavior:** `merge` lets all sources run at the same time and forwards values as they arrive.

---

## `partition` — `splitBy`

**Source:** One source Observable is divided into two output Observables.
**Trigger:** Every source `next(value)` checks the predicate.
**Value:** Matching values go to the true stream, and non-matching values go to the false stream.
**Cardinality:** One source value is routed to one of two output streams.
**Time:** Routed values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Both output streams follow the source error and completion.

**Operator behavior:** `partition` splits one stream into two streams based on a predicate.

---

## `race` — `firstToEmit`

**Source:** Multiple input Observables compete.
**Trigger:** The first input to emit, error, or complete becomes the winner.
**Value:** The winning Observable is mirrored.
**Cardinality:** Many competing sources become one winning output stream.
**Time:** Timing is controlled by the winning Observable.
**Concurrency:** All competitors are subscribed concurrently at the beginning.
**Cancellation:** Losing Observables are unsubscribed after the winner is chosen.
**Termination:** The result follows the winner’s error or completion.

**Operator behavior:** `race` subscribes to all competitors, keeps the first one that speaks, and cancels the rest.

---

## `zip` — `pairEmissions`

**Source:** Multiple input Observables provide indexed values.
**Trigger:** Output happens when every input has one buffered value at the same emission index.
**Value:** Values with the same index are combined into a tuple or array.
**Cardinality:** One value from each source produces one combined output value.
**Time:** Output is paced by the slowest source.
**Concurrency:** All input Observables are subscribed concurrently.
**Cancellation:** Values wait in buffers until matching indexed partners arrive.
**Termination:** The result completes when no more complete pairs can be formed and errors when any input errors.

**Operator behavior:** `zip` aligns streams by emission position and emits one combined value per completed index group.

---

# Buffer operators

## `buffer` — `collectUntilSignal`

**Source:** One source Observable provides values, and one closing notifier provides flush signals.
**Trigger:** The closing notifier emits.
**Value:** Source values are collected into an array.
**Cardinality:** Many source values become one array value per closing signal.
**Time:** Buffer boundaries are controlled by the notifier.
**Concurrency:** The source and notifier are subscribed concurrently.
**Cancellation:** Unsubscribing clears the active buffer.
**Termination:** The active buffer is flushed on source completion, and errors are forwarded.

**Operator behavior:** `buffer` collects values until a signal arrives, then emits the collected array.

---

## `bufferCount` — `collectN`

**Source:** One source Observable provides values.
**Trigger:** The buffer reaches the configured count.
**Value:** Values are collected into an array.
**Cardinality:** N source values become one array value.
**Time:** Time is count-based, not clock-based.
**Concurrency:** No inner Observable is created.
**Cancellation:** Unsubscribing drops active buffers.
**Termination:** A partial buffer may be flushed on completion, and errors are forwarded.

**Operator behavior:** `bufferCount` collects a fixed number of values and emits each collected group.

---

## `bufferTime` — `collectForDuration`

**Source:** One source Observable provides values over time.
**Trigger:** A fixed time window closes.
**Value:** Values inside the time window are collected into an array.
**Cardinality:** Many source values in one time window become one array value.
**Time:** Fixed-duration windows control flushing.
**Concurrency:** Timers manage the active buffer windows.
**Cancellation:** Unsubscribing cancels timers and drops active buffers.
**Termination:** Active buffers are flushed on completion, and errors are forwarded.

**Operator behavior:** `bufferTime` collects values for a duration and emits arrays repeatedly over time.

---

## `bufferToggle` — `collectBetweenSignals`

**Source:** One source Observable provides values, one signal opens buffers, and another signal closes them.
**Trigger:** An opening signal starts a buffer, and a closing signal flushes it.
**Value:** Values between opening and closing signals are collected into arrays.
**Cardinality:** Many source values per open-close window become one array.
**Time:** Buffer lifetime is defined by opening and closing signals.
**Concurrency:** Multiple buffers may be active at the same time.
**Cancellation:** Unsubscribing closes and discards active buffers.
**Termination:** Active buffers are flushed on source completion, and errors are forwarded.

**Operator behavior:** `bufferToggle` collects values only between explicit open and close signals.

---

## `bufferWhen` — `collectUntilFactory`

**Source:** One source Observable provides values, and a closing selector creates boundary signals.
**Trigger:** The current closing signal emits.
**Value:** Values are collected into an array until the dynamic boundary closes.
**Cardinality:** Many source values per dynamic window become one array.
**Time:** Window timing is controlled by dynamically created closing Observables.
**Concurrency:** Usually one buffer is active at a time.
**Cancellation:** Unsubscribing cancels the active closing signal.
**Termination:** The active buffer is flushed on completion, and errors are forwarded.

**Operator behavior:** `bufferWhen` repeatedly collects values until a dynamically created boundary says “flush now.”

---

# Higher-order transformation operators

## `concatMap` — `transformSequentially`

**Source:** Each source value is used to create inner work.
**Trigger:** Every source `next(value)` calls the projection function.
**Value:** The source value is mapped to an inner Observable.
**Cardinality:** One source value may produce many inner values.
**Time:** Inner Observables define result timing.
**Concurrency:** Inner Observables are queued while one is active.
**Cancellation:** New source values do not cancel the active inner Observable.
**Termination:** The result completes after the source, the queue, and the active inner complete; errors terminate the result.

**Operator behavior:** `concatMap` turns values into inner Observables and runs them one after another in order.

---

## `concatMapTo` — `switchToSequentially`

**Source:** Each source value triggers the same inner Observable.
**Trigger:** Every source `next(value)` requests the fixed inner Observable.
**Value:** The source value is replaced by the same inner Observable.
**Cardinality:** One source value may produce many inner values.
**Time:** The fixed inner Observable defines result timing.
**Concurrency:** Inner subscriptions are queued sequentially.
**Cancellation:** New source values do not cancel the active inner Observable.
**Termination:** The result completes after the source, the queue, and the active inner complete; errors terminate the result.

**Operator behavior:** `concatMapTo` ignores the incoming value and runs the same inner Observable once per source value, sequentially.

---

## `exhaust` — `ignoreWhileBusy`

**Source:** A higher-order Observable emits inner Observables.
**Trigger:** An outer `next(inner$)` is accepted only when no inner is active.
**Value:** The accepted inner Observable is flattened.
**Cardinality:** Only accepted inner Observables can produce output values.
**Time:** The accepted inner Observable defines output timing.
**Concurrency:** Only one inner Observable may be active.
**Cancellation:** New inner Observables are ignored while busy.
**Termination:** The result completes after the outer source and active inner complete; errors terminate the result.

**Operator behavior:** `exhaust` subscribes to the first inner Observable and ignores new inner Observables until the active one completes.

---

## `exhaustMap` — `transformIfNotBusy`

**Source:** Each source value may create inner work.
**Trigger:** A source `next(value)` is accepted only when no inner Observable is active.
**Value:** Accepted values are mapped to inner Observables.
**Cardinality:** Accepted source values may produce many inner values.
**Time:** The active inner Observable defines output timing.
**Concurrency:** Only one inner Observable may be active.
**Cancellation:** New source values are ignored while busy and do not cancel the active inner.
**Termination:** The result completes after the source and active inner complete; errors terminate the result.

**Operator behavior:** `exhaustMap` starts inner work when idle and ignores new source values while that work is running.

---

## `expand` — `expandRecursively`

**Source:** The original source values and generated values both feed the expansion process.
**Trigger:** Each emitted value triggers the recursive projection function.
**Value:** The value is mapped to another Observable whose values are also expanded.
**Cardinality:** One value can recursively produce many more values.
**Time:** Source and generated inner Observables define timing.
**Concurrency:** Recursive inner Observables may overlap according to the concurrency setting.
**Cancellation:** Unsubscribing cancels all active recursive work.
**Termination:** The result completes when the source and all recursive expansions complete; errors terminate the result.

**Operator behavior:** `expand` recursively grows the stream by feeding produced values back into the projection policy.

---

## `groupBy` — `groupInto`

**Source:** Each source value carries or produces a grouping key.
**Trigger:** Every source `next(value)` computes or reads the key.
**Value:** The value is routed into a grouped Observable for that key.
**Cardinality:** One source value goes into one group, and each new key creates a grouped Observable.
**Time:** Groups are created and values are routed immediately.
**Concurrency:** Multiple grouped Observables can be active at the same time.
**Cancellation:** Group lifetimes may end by unsubscription or duration policy.
**Termination:** Groups complete when the source completes and error when the source errors.

**Operator behavior:** `groupBy` splits one stream into keyed substreams.

---

## `mapTo` — `replaceWith`

**Source:** Each source value flows into the operator.
**Trigger:** Every source `next(value)` triggers replacement.
**Value:** The original value is replaced with a constant value.
**Cardinality:** One source value produces one constant result value.
**Time:** The constant value is emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `mapTo` ignores each incoming value and emits the same replacement value each time.

---

## `mergeMap` — `transformConcurrently`

**Source:** Each source value is used to create inner work.
**Trigger:** Every source `next(value)` calls the projection function.
**Value:** The source value is mapped to an inner Observable.
**Cardinality:** One source value may produce many inner values.
**Time:** Inner Observables define result timing.
**Concurrency:** Multiple inner Observables may run at the same time.
**Cancellation:** New source values do not cancel previous inner Observables.
**Termination:** The result completes after the source and all active inner Observables complete; errors terminate the result.

**Operator behavior:** `mergeMap` turns values into inner Observables and allows their work to overlap.

---

## `mergeMapTo` — `mergeInto`

**Source:** Each source value triggers the same inner Observable.
**Trigger:** Every source `next(value)` requests the fixed inner Observable.
**Value:** The source value is replaced by the same inner Observable.
**Cardinality:** One source value may produce many inner values.
**Time:** The fixed inner Observable defines result timing.
**Concurrency:** Multiple inner subscriptions may run at the same time.
**Cancellation:** New source values do not cancel previous inner subscriptions.
**Termination:** The result completes after the source and all active inner subscriptions complete; errors terminate the result.

**Operator behavior:** `mergeMapTo` ignores the incoming value and concurrently subscribes to the same inner Observable for each source value.

---

## `mergeScan` — `accumulateConcurrently`

**Source:** Each source value and the current accumulator state flow into the projection.
**Trigger:** Every source `next(value)` starts an accumulator projection.
**Value:** The accumulator function returns an inner Observable of new state values.
**Cardinality:** One source value may produce many state values.
**Time:** Inner state Observables define result timing.
**Concurrency:** Multiple accumulator inner Observables may overlap.
**Cancellation:** New source values do not cancel previous accumulator inner Observables.
**Termination:** The result completes after the source and all active accumulator Observables complete; errors terminate the result.

**Operator behavior:** `mergeScan` is state accumulation where each update can be asynchronous and overlapping.

---

## `pairwise` — `withPrevious`

**Source:** Source values flow with memory of the previous value.
**Trigger:** Each source `next(value)` after the first triggers output.
**Value:** The previous and current values are paired.
**Cardinality:** Two adjacent source values produce one pair.
**Time:** The pair is emitted immediately when the current value arrives.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `pairwise` emits `[previous, current]` for each value after the first.

---

## `pluck` — `pickProperty`

**Source:** Each source value is expected to be an object or path-compatible value.
**Trigger:** Every source `next(value)` triggers property selection.
**Value:** The configured property or path is extracted.
**Cardinality:** One source object produces one selected property value.
**Time:** The selected value is emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `pluck` extracts a property path from each emitted object.

---

## `scan` — `accumulate`

**Source:** Each source value flows together with remembered accumulator state.
**Trigger:** Every source `next(value)` runs the accumulator function.
**Value:** The accumulator state is updated.
**Cardinality:** One source value produces one new state value.
**Time:** The new state is emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `scan` turns a stream of values into a stream of remembered state over time.

---

## `switchScan` — `accumulateSwitching`

**Source:** Each source value and current state feed an asynchronous accumulator.
**Trigger:** Every source `next(value)` starts a new accumulator inner Observable.
**Value:** The accumulator projection maps state and value to an inner Observable of state.
**Cardinality:** One source value may produce many state values.
**Time:** The latest accumulator inner Observable defines result timing.
**Concurrency:** Only the latest accumulator inner Observable is active.
**Cancellation:** A new source value cancels the previous accumulator inner Observable.
**Termination:** The result completes after the source and latest inner complete; errors terminate the result.

**Operator behavior:** `switchScan` accumulates state asynchronously, but only the latest state-producing inner Observable remains active.

---

## `switchMap` — `transformSwitching`

**Source:** Each source value is used to create inner work.
**Trigger:** Every source `next(value)` calls the projection function.
**Value:** The source value is mapped to an inner Observable.
**Cardinality:** One source value may produce many inner values.
**Time:** The latest inner Observable defines output timing.
**Concurrency:** Only the latest inner Observable is active.
**Cancellation:** A new source value cancels the previous inner Observable subscription.
**Termination:** The result completes after the source and latest active inner complete; errors terminate the result.

**Operator behavior:** `switchMap` starts new inner work for each source value and cancels the previous work so only the latest inner Observable can emit.

---

## `switchMapTo` — `switchTo`

**Source:** Each source value triggers the same inner Observable.
**Trigger:** Every source `next(value)` requests the fixed inner Observable.
**Value:** The source value is replaced by the same inner Observable.
**Cardinality:** One source value may produce many inner values.
**Time:** The latest inner Observable subscription defines output timing.
**Concurrency:** Only the latest inner subscription is active.
**Cancellation:** A new source value cancels the previous inner subscription.
**Termination:** The result completes after the source and latest inner complete; errors terminate the result.

**Operator behavior:** `switchMapTo` ignores the source value and switches to a new subscription of the same inner Observable each time.

---

# Window operators

## `window` — `windowUntilSignal`

**Source:** One source Observable provides values, and a closing notifier provides window boundaries.
**Trigger:** The closing notifier emits.
**Value:** Source values are routed into an inner Observable window.
**Cardinality:** Many source values become one inner Observable window.
**Time:** Window boundaries are controlled by the notifier.
**Concurrency:** Usually one window is active at a time.
**Cancellation:** Unsubscribing closes the active window.
**Termination:** The active window closes when the source completes, and errors are forwarded.

**Operator behavior:** `window` groups values into inner Observables instead of arrays.

---

## `windowCount` — `windowOfN`

**Source:** One source Observable provides values.
**Trigger:** The window reaches the configured count.
**Value:** Source values are routed into an inner Observable window.
**Cardinality:** N source values form one window.
**Time:** Windowing is count-based, not clock-based.
**Concurrency:** Windows may overlap depending on configuration.
**Cancellation:** Unsubscribing closes active windows.
**Termination:** Active windows close on source completion, and errors are forwarded.

**Operator behavior:** `windowCount` creates inner Observable windows based on value count.

---

## `windowTime` — `windowForDuration`

**Source:** One source Observable provides values over time.
**Trigger:** A fixed time window closes.
**Value:** Source values are routed into an inner Observable window.
**Cardinality:** Many values in a time range become one window Observable.
**Time:** Fixed-duration timers control windows.
**Concurrency:** Windows may overlap depending on configuration.
**Cancellation:** Unsubscribing closes active windows and cancels timers.
**Termination:** Active windows close on source completion, and errors are forwarded.

**Operator behavior:** `windowTime` creates inner Observable windows over fixed time intervals.

---

## `windowToggle` — `windowBetweenSignals`

**Source:** One source Observable provides values, one signal opens windows, and another signal closes them.
**Trigger:** An opening signal starts a window, and a closing signal closes it.
**Value:** Source values are routed into windows between open and close signals.
**Cardinality:** Many values in an open-close interval become one inner Observable window.
**Time:** Signal Observables control window lifetime.
**Concurrency:** Multiple windows may overlap.
**Cancellation:** Unsubscribing closes active windows.
**Termination:** Active windows close on source completion, and errors are forwarded.

**Operator behavior:** `windowToggle` creates inner Observable windows between explicit opening and closing signals.

---

## `windowWhen` — `windowUntilFactory`

**Source:** One source Observable provides values, and a closing selector creates dynamic boundaries.
**Trigger:** The current closing signal emits.
**Value:** Source values are routed into the active inner Observable window.
**Cardinality:** Many values per dynamic boundary become one window Observable.
**Time:** Dynamic closing Observables control window timing.
**Concurrency:** Usually one window is active at a time.
**Cancellation:** Unsubscribing cancels the active closing signal and closes the active window.
**Termination:** The active window closes on source completion, and errors are forwarded.

**Operator behavior:** `windowWhen` repeatedly opens a window and closes it when a dynamically created boundary fires.

---

# Filtering and timing operators

## `audit` — `emitLatestAfterSignal`

**Source:** Source values arrive while a duration selector creates audit windows.
**Trigger:** The first source value opens an audit window, and the duration signal closes it.
**Value:** The latest suppressed source value is emitted when the window closes.
**Cardinality:** Many source values in one audit window become at most one output value.
**Time:** The duration signal controls the audit window.
**Concurrency:** Only one audit window is active at a time.
**Cancellation:** Older suppressed values are replaced by newer suppressed values.
**Termination:** Errors are forwarded, and completion waits for the active audit behavior to settle.

**Operator behavior:** `audit` ignores values during a signal-controlled window and emits the latest remembered value when the window closes.

---

## `auditTime` — `emitLatestAfterDelay`

**Source:** Source values arrive over time.
**Trigger:** The first source value opens a fixed audit window.
**Value:** The latest suppressed value is emitted when the fixed duration ends.
**Cardinality:** Many source values in one audit window become at most one output value.
**Time:** A fixed duration controls the audit window.
**Concurrency:** Only one audit window is active at a time.
**Cancellation:** Older suppressed values are replaced by newer suppressed values.
**Termination:** Errors are forwarded, and completion waits for active audit timing to settle.

**Operator behavior:** `auditTime` samples the latest value after each fixed cooldown window.

---

## `debounce` — `afterSilence`

**Source:** Source values arrive over time.
**Trigger:** A per-value duration signal must complete or emit before another source value arrives.
**Value:** The pending value is emitted only if it survives the silence period.
**Cardinality:** Many rapid source values collapse to the latest surviving value.
**Time:** The silence duration is controlled by a per-value signal Observable.
**Concurrency:** Only the latest pending value matters.
**Cancellation:** A new source value cancels the previous pending emission.
**Termination:** Errors are forwarded, and completion emits the pending value if its debounce condition is satisfied.

**Operator behavior:** `debounce` waits for dynamic silence and emits only the latest value that was not replaced.

---

## `debounceTime` — `afterSilenceOf`

**Source:** Source values arrive over time.
**Trigger:** A fixed silence duration must pass after a source value.
**Value:** The pending source value is emitted after silence.
**Cardinality:** Many rapid source values collapse to the latest surviving value.
**Time:** A fixed duration controls silence.
**Concurrency:** Only the latest pending value matters.
**Cancellation:** A new source value cancels the previous pending emission.
**Termination:** Errors are forwarded, and completion emits the pending value if appropriate.

**Operator behavior:** `debounceTime` emits a value only after the source has stopped changing for a fixed time.

---

## `distinct` — `uniqueValues`

**Source:** Each source value flows with memory of previously seen values.
**Trigger:** Every source `next(value)` checks the seen-value store.
**Value:** Only values not seen before are kept.
**Cardinality:** The result is a subset of source values.
**Time:** Kept values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `distinct` emits only globally new values across the stream history.

---

## `distinctUntilChanged` — `skipDuplicates`

**Source:** Each source value flows with memory of the previous value.
**Trigger:** Every source `next(value)` compares current with previous.
**Value:** Only values different from the immediately previous value are kept.
**Cardinality:** The result is a subset of source values.
**Time:** Kept values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `distinctUntilChanged` removes only consecutive duplicates.

---

## `distinctUntilKeyChanged` — `skipDuplicatesBy`

**Source:** Each source object flows with memory of the previous selected key value.
**Trigger:** Every source `next(value)` compares the selected key.
**Value:** Values are kept only when the selected key changed.
**Cardinality:** The result is a subset of source values.
**Time:** Kept values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `distinctUntilKeyChanged` removes consecutive duplicates by a selected object key.

---

## `elementAt` — `atIndex`

**Source:** Source values are treated as indexed emissions.
**Trigger:** The requested index arrives.
**Value:** Only the value at the requested index is emitted.
**Cardinality:** Many source values produce at most one selected value.
**Time:** The selected value is emitted when its index is reached.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled after the selected value is found.
**Termination:** The result completes after the selected value or errors/defaults if the index is missing.

**Operator behavior:** `elementAt` selects exactly one emission by index.

---

## `first` — `takeFirst`

**Source:** Source values are searched from the beginning.
**Trigger:** The first value, or first matching value, arrives.
**Value:** That first matching value is emitted.
**Cardinality:** Many source values produce one selected value.
**Time:** Output happens immediately at the first match.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled after the first match.
**Termination:** The result completes after the first match or errors/defaults if no match exists.

**Operator behavior:** `first` emits the first acceptable value and then stops the stream.

---

## `ignoreElements` — `suppressValues`

**Source:** Source next, error, and complete notifications flow into the operator.
**Trigger:** Every source notification is observed.
**Value:** All `next` values are dropped.
**Cardinality:** Many source values become zero output values.
**Time:** Error and completion timing is preserved.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `ignoreElements` silences values but keeps the stream’s error and completion protocol.

---

## `last` — `takeLast`

**Source:** Source values are remembered until completion.
**Trigger:** Source completion triggers final selection.
**Value:** The last value, or last matching value, is emitted.
**Cardinality:** Many source values produce one final value.
**Time:** Output happens only when the source completes.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The result completes after emitting the last value or errors/defaults if no match exists.

**Operator behavior:** `last` waits until completion and emits the final acceptable value.

---

## `sample` — `snapshotOn`

**Source:** One source Observable provides values, and a sampler Observable provides snapshot signals.
**Trigger:** The sampler emits.
**Value:** The latest remembered source value is emitted.
**Cardinality:** Many source values become at most one output per sampler signal.
**Time:** The sampler controls output timing.
**Concurrency:** Source and sampler are subscribed concurrently.
**Cancellation:** Source values are not cancelled; only the latest is remembered.
**Termination:** The result completes with the source and errors if source or sampler errors.

**Operator behavior:** `sample` takes a snapshot of the latest source value whenever another stream says “now.”

---

## `sampleTime` — `snapshotEvery`

**Source:** One source Observable provides values over time.
**Trigger:** A periodic timer ticks.
**Value:** The latest remembered source value is emitted.
**Cardinality:** Many source values become at most one output per timer tick.
**Time:** A fixed interval controls output timing.
**Concurrency:** The source and timer run concurrently.
**Cancellation:** Source values are not cancelled; only the latest is remembered.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `sampleTime` periodically emits the latest known source value.

---

## `single` — `exactlyOne`

**Source:** Source values are checked against an optional predicate.
**Trigger:** Matching values are counted until completion or until a second match appears.
**Value:** The one matching value is emitted.
**Cardinality:** Many source values must produce exactly one result value.
**Time:** Output usually happens at completion, unless an error is known earlier.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled early if more than one match is found.
**Termination:** The result completes after the single match or errors if there are zero or multiple matches.

**Operator behavior:** `single` requires exactly one matching value and treats zero or multiple matches as failure.

---

## `skip` — `dropFirst`

**Source:** Source values are counted from the beginning.
**Trigger:** Every source `next(value)` increments the count.
**Value:** The first N values are dropped, and later values are forwarded.
**Cardinality:** The result is the source minus its first N values.
**Time:** Values after the skipped prefix are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `skip` ignores the first N values and then lets the rest through.

---

## `skipLast` — `dropLast`

**Source:** Source values flow through a trailing buffer.
**Trigger:** A source value is emitted only when enough later values have arrived.
**Value:** Values are delayed through a buffer so the final N can be dropped.
**Cardinality:** The result is the source minus its last N values.
**Time:** Output is delayed by the trailing buffer.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The buffered last N values are dropped on completion, and errors are forwarded.

**Operator behavior:** `skipLast` forwards all values except the final N, which can only be known at completion.

---

## `skipUntil` — `startAfterSignal`

**Source:** One source Observable provides values, and one notifier provides a start signal.
**Trigger:** The start signal emits.
**Value:** Values before the signal are dropped, and values after the signal are forwarded.
**Cardinality:** The result is the suffix of the source after the signal.
**Time:** The notifier controls when forwarding begins.
**Concurrency:** Source and notifier are subscribed concurrently.
**Cancellation:** The notifier is unsubscribed after it starts the stream.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `skipUntil` ignores the source until another stream says “start now.”

---

## `skipWhile` — `dropWhile`

**Source:** Source values are checked in order.
**Trigger:** Every source value checks the predicate until the predicate becomes false.
**Value:** Values are dropped while the predicate is true, then all later values are forwarded.
**Cardinality:** The result is the source suffix after the predicate first fails.
**Time:** Forwarded values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `skipWhile` drops the initial prefix while a condition holds, then stops testing and passes everything through.

---

## `take` — `limitTo`

**Source:** Source values are counted from the beginning.
**Trigger:** Each source `next(value)` is forwarded until N values have been taken.
**Value:** The first N values are kept.
**Cardinality:** The result has at most N values.
**Time:** Taken values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled after the Nth value.
**Termination:** The result completes after N values or when the source completes earlier.

**Operator behavior:** `take` keeps the first N values and then completes early.

---

## `takeLast` — `lastN`

**Source:** Source values are stored in a trailing buffer.
**Trigger:** Source completion triggers output.
**Value:** The final N values are emitted.
**Cardinality:** Many source values produce at most N final values.
**Time:** Output happens only on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The result emits the buffer and completes, or errors if the source errors.

**Operator behavior:** `takeLast` waits for completion, then emits the final N values.

---

## `takeUntil` — `stopWhen`

**Source:** One source Observable provides values, and one notifier provides a stop signal.
**Trigger:** The stop signal emits.
**Value:** Source values are forwarded until the stop signal.
**Cardinality:** The result is the source prefix before the signal.
**Time:** The notifier controls when forwarding stops.
**Concurrency:** Source and notifier are subscribed concurrently.
**Cancellation:** The source is cancelled when the stop signal emits.
**Termination:** The result completes on the stop signal or source completion, and errors if source or notifier errors.

**Operator behavior:** `takeUntil` lets values through until another stream says “stop now.”

---

## `takeWhile` — `stopWhenNot`

**Source:** Source values are checked in order.
**Trigger:** Every source value checks the predicate.
**Value:** Values are forwarded while the predicate is true.
**Cardinality:** The result is the source prefix while the condition holds.
**Time:** Forwarded values are emitted immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled when the predicate becomes false.
**Termination:** The result completes when the predicate fails or when the source completes.

**Operator behavior:** `takeWhile` keeps values while a condition holds and completes when the condition fails.

---

## `throttle` — `limitRate`

**Source:** Source values arrive over time, and a duration selector defines suppression windows.
**Trigger:** The first allowed source value starts a throttle window.
**Value:** The allowed value is emitted, and later values are suppressed during the window.
**Cardinality:** Many rapid source values become at most one value per throttle window.
**Time:** The duration signal controls the throttle window.
**Concurrency:** One throttle window is active at a time.
**Cancellation:** Suppressed values during the active window are dropped.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `throttle` emits a value, then ignores values until the configured duration signal allows the next one.

---

## `throttleTime` — `limitRateTo`

**Source:** Source values arrive over time.
**Trigger:** The first allowed source value starts a fixed throttle window.
**Value:** The allowed value is emitted, and later values are suppressed during the fixed duration.
**Cardinality:** Many rapid source values become at most one value per time window.
**Time:** A fixed duration controls the throttle window.
**Concurrency:** One throttle window is active at a time.
**Cancellation:** Suppressed values during the active window are dropped.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `throttleTime` emits one value, then blocks further values for a fixed time.

---

# Higher-order join operators

## `combineLatestAll` — `combineAllLatest`

**Source:** A higher-order Observable emits inner Observables.
**Trigger:** After the outer source completes, inner latest-combination behavior begins.
**Value:** Latest values from all collected inner Observables are combined.
**Cardinality:** Many inner streams produce one combined output stream.
**Time:** Output timing is controlled by inner emissions after all inners have emitted.
**Concurrency:** Collected inner Observables are subscribed concurrently.
**Cancellation:** Unsubscribing cancels all active inner subscriptions.
**Termination:** The result completes when all inner Observables complete and errors when outer or inner errors.

**Operator behavior:** `combineLatestAll` waits for the outer stream of inner streams to finish, then combines the latest values from the collected inner streams.

---

## `concatAll` — `joinSequentially`

**Source:** A higher-order Observable emits inner Observables.
**Trigger:** An inner Observable is subscribed when the previous inner completes.
**Value:** Inner values are forwarded sequentially.
**Cardinality:** Many inner streams become one output stream.
**Time:** Each active inner Observable controls timing while it is active.
**Concurrency:** Only one inner Observable is active at a time.
**Cancellation:** New inner Observables do not cancel the active inner; they wait.
**Termination:** The result completes after the outer source and all queued inner Observables complete; errors terminate the result.

**Operator behavior:** `concatAll` flattens inner Observables one at a time in order.

---

## `exhaustAll` — `joinIfNotBusy`

**Source:** A higher-order Observable emits inner Observables.
**Trigger:** An outer `next(inner$)` is accepted only when idle.
**Value:** Accepted inner values are forwarded.
**Cardinality:** Only accepted inner Observables produce output.
**Time:** The active inner Observable controls output timing.
**Concurrency:** Only one inner Observable is active.
**Cancellation:** New inner Observables are ignored while busy.
**Termination:** The result completes after the outer source and active inner complete; errors terminate the result.

**Operator behavior:** `exhaustAll` flattens the first inner Observable and ignores later inners while it is active.

---

## `mergeAll` — `joinConcurrently`

**Source:** A higher-order Observable emits inner Observables.
**Trigger:** Every outer `next(inner$)` subscribes to that inner Observable.
**Value:** Values from all active inner Observables are forwarded.
**Cardinality:** Many inner streams become one interleaved output stream.
**Time:** Each inner Observable controls the timing of its own values.
**Concurrency:** Multiple inner Observables may be active at the same time.
**Cancellation:** New inner Observables do not cancel previous inner Observables.
**Termination:** The result completes after the outer source and all active inner Observables complete; errors terminate the result.

**Operator behavior:** `mergeAll` flattens inner Observables concurrently.

---

## `switchAll` — `joinSwitching`

**Source:** A higher-order Observable emits inner Observables.
**Trigger:** Every outer `next(inner$)` switches to that latest inner Observable.
**Value:** Only values from the latest inner Observable are forwarded.
**Cardinality:** Many inner streams become one latest-only output stream.
**Time:** The latest inner Observable controls output timing.
**Concurrency:** Only the latest inner Observable is active.
**Cancellation:** A new inner Observable cancels the previous inner subscription.
**Termination:** The result completes after the outer source and latest inner complete; errors terminate the result.

**Operator behavior:** `switchAll` always listens to the latest inner Observable and cancels the previous one.

---

## `startWith` — `prependWith`

**Source:** Initial values are placed before the source Observable.
**Trigger:** Subscription triggers the initial emissions before the source starts emitting.
**Value:** Initial values are prepended to the source values.
**Cardinality:** The result contains initial values plus source values.
**Time:** Initial values emit first, then source timing takes over.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded after initial values.

**Operator behavior:** `startWith` gives a stream one or more initial values before normal source values arrive.

---

## `withLatestFrom` — `pairWithLatest`

**Source:** One primary source Observable combines with secondary Observables.
**Trigger:** Only the primary source emitting triggers output.
**Value:** The primary value is paired with the latest secondary values.
**Cardinality:** One primary value produces one combined value if all secondaries have latest values.
**Time:** Output timing is controlled by the primary source.
**Concurrency:** Primary and secondary Observables are subscribed concurrently.
**Cancellation:** Secondary values are not cancelled; only their latest values are remembered.
**Termination:** The result completes when the primary source completes and errors when any input errors.

**Operator behavior:** `withLatestFrom` lets the primary stream decide when to emit, while attaching latest context from other streams.

---

# Multicasting operators

## `multicast` — `shareVia`

**Source:** One cold source Observable is routed through a Subject or Subject factory.
**Trigger:** Connection or subscription starts the shared source depending on usage.
**Value:** Source notifications are sent through the Subject.
**Cardinality:** One source subscription feeds many subscribers.
**Time:** Subscribers observe the shared source timing through the Subject.
**Concurrency:** One producer is shared by multiple observers.
**Cancellation:** Disconnecting unsubscribes from the shared source.
**Termination:** The Subject forwards source error and completion.

**Operator behavior:** `multicast` shares one source subscription through a Subject.

---

## `publish` — `makeHot`

**Source:** One cold source Observable is converted into a connectable Observable.
**Trigger:** Calling `connect` starts the shared source subscription.
**Value:** Source notifications are shared through a plain Subject.
**Cardinality:** One source subscription feeds many subscribers.
**Time:** Values begin after explicit connection.
**Concurrency:** One producer is shared by multiple observers.
**Cancellation:** Disconnecting cancels the shared source subscription.
**Termination:** Source error and completion are forwarded to subscribers.

**Operator behavior:** `publish` makes a source explicitly connectable and shared.

---

## `publishBehavior` — `makeHotWithLatest`

**Source:** One cold source Observable is shared through a BehaviorSubject.
**Trigger:** Connection starts the source, and late subscription receives the current value.
**Value:** The current/latest value is replayed to new subscribers.
**Cardinality:** One source subscription feeds many subscribers with a current value.
**Time:** New subscribers receive the current value immediately, then source timing continues.
**Concurrency:** One producer is shared by multiple observers.
**Cancellation:** Disconnecting cancels the shared source subscription.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `publishBehavior` shares a source and gives subscribers the latest/current value through BehaviorSubject behavior.

---

## `publishLast` — `makeHotWithLastValue`

**Source:** One cold source Observable is shared through an AsyncSubject.
**Trigger:** Source completion triggers final value delivery.
**Value:** Only the last source value is emitted to subscribers.
**Cardinality:** Many source values become one final shared value.
**Time:** Output happens only on completion.
**Concurrency:** One producer is shared by multiple observers.
**Cancellation:** Disconnecting cancels the shared source subscription.
**Termination:** The last value is emitted on completion, or error is forwarded.

**Operator behavior:** `publishLast` shares a source but only releases the final value when the source completes.

---

## `publishReplay` — `makeHotWithReplay`

**Source:** One cold source Observable is shared through a ReplaySubject.
**Trigger:** Connection starts the source, and late subscription receives replayed values.
**Value:** Buffered past values are replayed to new subscribers.
**Cardinality:** One source subscription feeds many subscribers with replay.
**Time:** Replay happens immediately on subscription, then source timing continues.
**Concurrency:** One producer is shared by multiple observers.
**Cancellation:** Disconnecting cancels the shared source subscription.
**Termination:** Source error and completion are forwarded and may be replayed.

**Operator behavior:** `publishReplay` shares a source and replays buffered history to later subscribers.

---

## `share` — `shareAmong`

**Source:** One cold source Observable is shared among subscribers.
**Trigger:** The first subscriber starts the source subscription.
**Value:** Source notifications are multicast to current subscribers.
**Cardinality:** One source subscription feeds many subscribers.
**Time:** Subscribers share the same source timing while subscribed.
**Concurrency:** One producer is shared by multiple observers.
**Cancellation:** The source is unsubscribed when the subscriber count drops to zero, depending on configuration.
**Termination:** Error, completion, and reset behavior follow the share configuration.

**Operator behavior:** `share` turns a cold source into a shared source while subscribers are present.

---

# Error handling operators

## `catchError` — `handleError`

**Source:** One source Observable may emit values or error.
**Trigger:** A source error activates the recovery function.
**Value:** The error is replaced by a recovery Observable or rethrown.
**Cardinality:** One error may become many recovery values or another error.
**Time:** The recovery Observable defines timing after the error.
**Concurrency:** Recovery starts after the source has failed.
**Cancellation:** Unsubscribing cancels the recovery Observable.
**Termination:** The result continues with recovery or terminates if the error is rethrown.

**Operator behavior:** `catchError` turns a stream failure into a replacement stream.

---

## `retry` — `tryAgain`

**Source:** One source Observable may fail.
**Trigger:** A source error triggers resubscription if retry limits allow it.
**Value:** The same source execution is attempted again.
**Cardinality:** Values may be emitted from multiple attempts.
**Time:** Retry timing is immediate or configured.
**Concurrency:** Only one attempt runs at a time.
**Cancellation:** Unsubscribing cancels the current attempt and prevents future retries.
**Termination:** The result completes when an attempt completes or errors when retries are exhausted.

**Operator behavior:** `retry` resubscribes to the source after errors according to a retry policy.

---

## `retryWhen` — `retryWhenSignaled`

**Source:** One source Observable may fail, and a notifier controls retries.
**Trigger:** A source error is passed to the notifier, and notifier emission triggers retry.
**Value:** The same source execution is attempted again.
**Cardinality:** Values may be emitted from multiple attempts.
**Time:** The notifier controls retry timing.
**Concurrency:** Only one source attempt runs at a time.
**Cancellation:** Unsubscribing cancels the attempt and notifier subscription.
**Termination:** The result completes when the source completes or errors when the notifier/errors policy terminates.

**Operator behavior:** `retryWhen` retries the source when another stream says retry is allowed.

---

# Utility operators

## `tap` — `sideEffect`

**Source:** Source next, error, and complete notifications pass through the operator.
**Trigger:** Each observed notification triggers the side-effect handler.
**Value:** The original value is forwarded unchanged.
**Cardinality:** One input notification produces one output notification unless the side effect throws.
**Time:** Side effects happen immediately during notification delivery.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Original error and completion are forwarded, unless the side effect throws an error.

**Operator behavior:** `tap` observes the stream for side effects without changing the values.

---

## `delay` — `delayBy`

**Source:** Source values and completion flow into scheduler-based delay.
**Trigger:** Each source value schedules a later emission.
**Value:** The same value is forwarded later.
**Cardinality:** One source value produces one delayed value.
**Time:** A fixed delay shifts value delivery forward.
**Concurrency:** Scheduled timers may overlap.
**Cancellation:** Unsubscribing cancels scheduled values.
**Termination:** Completion is delayed until scheduled values flush, while errors are forwarded according to RxJS delay behavior.

**Operator behavior:** `delay` shifts value emissions later in time without changing the values.

---

## `delayWhen` — `delayUntilSignal`

**Source:** Each source value gets its own delay signal.
**Trigger:** The per-value delay signal emits or completes.
**Value:** The original value is forwarded after its delay signal.
**Cardinality:** One source value produces one delayed value.
**Time:** Each value has signal-controlled timing.
**Concurrency:** Multiple delay signals may be active at the same time.
**Cancellation:** Unsubscribing cancels pending delayed values.
**Termination:** The result completes after the source and pending delays complete, and errors are forwarded.

**Operator behavior:** `delayWhen` delays each value until its own Observable signal allows it through.

---

## `dematerialize` — `unwrapNotification`

**Source:** The source emits Notification objects as ordinary values.
**Trigger:** Each Notification value is read.
**Value:** Notification values are converted back into `next`, `error`, or `complete` protocol events.
**Cardinality:** One Notification value becomes one stream protocol event.
**Time:** Conversion happens immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Error and complete Notification values terminate the result stream.

**Operator behavior:** `dematerialize` turns Notification values back into real Observable events.

---

## `materialize` — `wrapAsNotification`

**Source:** Source next, error, and complete protocol events flow into the operator.
**Trigger:** Every source protocol event is observed.
**Value:** Each protocol event is wrapped as a Notification object.
**Cardinality:** One protocol event becomes one Notification value.
**Time:** Wrapping happens immediately.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** After wrapping error or completion as a value, the result completes.

**Operator behavior:** `materialize` turns `next`, `error`, and `complete` into ordinary inspectable values.

---

## `observeOn` — `scheduleOn`

**Source:** Source notifications flow into a scheduler boundary.
**Trigger:** Each source notification is scheduled for later delivery.
**Value:** The notification itself is not changed.
**Cardinality:** One input notification produces one scheduled output notification.
**Time:** The scheduler controls delivery timing.
**Concurrency:** The scheduler queue controls ordering and delivery context.
**Cancellation:** Unsubscribing cancels scheduled notifications not yet delivered.
**Termination:** Error and completion are delivered through the scheduler.

**Operator behavior:** `observeOn` changes where and when notifications are delivered, not what values mean.

---

## `subscribeOn` — `subscribeUsing`

**Source:** The source subscription side effect is scheduled.
**Trigger:** A downstream subscriber subscribes.
**Value:** Source values are forwarded unchanged.
**Cardinality:** The result has the same value cardinality as the source.
**Time:** The scheduler controls when subscription starts.
**Concurrency:** The scheduler controls producer startup context.
**Cancellation:** Unsubscribing can cancel a scheduled subscription or active subscription.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `subscribeOn` changes when and where the source subscription starts.

---

## `timeInterval` — `withTimeInterval`

**Source:** Source values flow with access to scheduler time.
**Trigger:** Every source `next(value)` measures elapsed time since the previous emission.
**Value:** The value is wrapped with an interval measurement.
**Cardinality:** One source value produces one timed object.
**Time:** Scheduler time is used for measurement.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `timeInterval` attaches the time gap since the previous emission to each value.

---

## `timestamp` — `withTimestamp`

**Source:** Source values flow with access to scheduler time.
**Trigger:** Every source `next(value)` reads the current timestamp.
**Value:** The value is wrapped with the timestamp.
**Cardinality:** One source value produces one timestamped object.
**Time:** Scheduler time is used for the timestamp.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** Source error and completion are forwarded.

**Operator behavior:** `timestamp` attaches the current time to each emitted value.

---

## `timeout` — `failAfter`

**Source:** One source Observable is watched by a deadline policy.
**Trigger:** The deadline fires before the required source emission.
**Value:** A timeout error is raised.
**Cardinality:** Source values pass through until a timeout error occurs.
**Time:** A configured deadline controls failure timing.
**Concurrency:** The source and timeout timer run concurrently.
**Cancellation:** The timer is reset or cancelled according to the timeout configuration.
**Termination:** The result errors on timeout or follows source error and completion.

**Operator behavior:** `timeout` fails the stream if the source is too slow.

---

## `timeoutWith` — `fallbackAfter`

**Source:** One source Observable is watched by a deadline policy and has a fallback Observable.
**Trigger:** The deadline fires before the required source emission.
**Value:** The source is replaced by the fallback Observable.
**Cardinality:** Source values pass through until timeout; after timeout, fallback values may emit.
**Time:** Deadline timing controls the switch, then fallback timing controls output.
**Concurrency:** The source and timer run concurrently until timeout.
**Cancellation:** The source is cancelled when fallback takes over.
**Termination:** The result follows source termination before timeout or fallback termination after timeout.

**Operator behavior:** `timeoutWith` switches to a fallback stream if the source is too slow.

---

## `toArray` — `collectAll`

**Source:** All source values are collected.
**Trigger:** Source completion triggers output.
**Value:** Collected values are emitted as one array.
**Cardinality:** Many source values become one array value.
**Time:** Output happens only on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** Unsubscribing drops the collected values.
**Termination:** The result emits the array and completes, or errors if the source errors.

**Operator behavior:** `toArray` waits until the source completes, then emits all collected values as a single array.

---

# Conditional and boolean operators

## `defaultIfEmpty` — `orDefault`

**Source:** One source Observable may emit zero or more values.
**Trigger:** Source completion checks whether any value was emitted.
**Value:** A default value is emitted if the source was empty.
**Cardinality:** Zero source values become one default value; non-empty sources pass through.
**Time:** The default case happens on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The result completes after the default or normal source completion, and errors if the source errors.

**Operator behavior:** `defaultIfEmpty` turns an empty completed stream into a stream with one fallback value.

---

## `every` — `allMatch`

**Source:** Source values are checked against a predicate.
**Trigger:** Every source value checks the predicate until failure or completion.
**Value:** A boolean result is produced.
**Cardinality:** Many source values produce one boolean value.
**Time:** `false` may emit early; `true` emits only on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled early when the predicate fails.
**Termination:** The result emits the boolean and completes, or errors if the source errors.

**Operator behavior:** `every` checks whether all source values satisfy a predicate.

---

## `find` — `firstMatch`

**Source:** Source values are searched with a predicate.
**Trigger:** The first matching value or source completion decides the result.
**Value:** The first matching value is emitted.
**Cardinality:** Many source values produce one optional result value.
**Time:** A match emits immediately; no match resolves on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled after the first match.
**Termination:** The result completes after emitting the match or completing without one, and errors if the source errors.

**Operator behavior:** `find` emits the first value that satisfies a predicate.

---

## `findIndex` — `firstMatchIndex`

**Source:** Indexed source values are searched with a predicate.
**Trigger:** The first matching value or source completion decides the result.
**Value:** The index of the first matching value is emitted.
**Cardinality:** Many source values produce one index value.
**Time:** A matching index emits immediately; no match resolves on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled after the first match.
**Termination:** The result completes after emitting the index or no-match result, and errors if the source errors.

**Operator behavior:** `findIndex` emits the index of the first value that satisfies a predicate.

---

## `isEmpty` — `hasNoValues`

**Source:** One source Observable may emit zero or more values.
**Trigger:** The first source value or source completion decides the result.
**Value:** `false` is emitted if a value appears, and `true` is emitted if completion happens first.
**Cardinality:** Many possible source values produce one boolean value.
**Time:** `false` can emit immediately on the first value; `true` emits on empty completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** The source is cancelled after the first value.
**Termination:** The result emits the boolean and completes, or errors if the source errors.

**Operator behavior:** `isEmpty` tells whether the source completed without emitting any value.

---

# Mathematical and aggregate operators

## `count` — `countValues`

**Source:** Source values are counted.
**Trigger:** Source completion triggers the count result.
**Value:** The count is emitted as a number.
**Cardinality:** Many source values produce one number.
**Time:** Output happens only on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The result emits the count and completes, or errors if the source errors.

**Operator behavior:** `count` waits for completion and emits how many values passed through.

---

## `max` — `maximum`

**Source:** Comparable source values are observed.
**Trigger:** Source completion triggers the maximum result.
**Value:** The largest remembered value is emitted.
**Cardinality:** Many source values produce one maximum value.
**Time:** Output happens only on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The result emits the maximum and completes, or errors if the source errors.

**Operator behavior:** `max` waits for completion and emits the largest value.

---

## `min` — `minimum`

**Source:** Comparable source values are observed.
**Trigger:** Source completion triggers the minimum result.
**Value:** The smallest remembered value is emitted.
**Cardinality:** Many source values produce one minimum value.
**Time:** Output happens only on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The result emits the minimum and completes, or errors if the source errors.

**Operator behavior:** `min` waits for completion and emits the smallest value.

---

## `reduce` — `foldInto`

**Source:** Source values flow through an accumulator.
**Trigger:** Every source value updates the accumulator, and source completion triggers output.
**Value:** The accumulator function builds one final result.
**Cardinality:** Many source values produce one final accumulated value.
**Time:** Output happens only on completion.
**Concurrency:** No inner Observable is created.
**Cancellation:** No inner work exists to cancel.
**Termination:** The result emits the final accumulator and completes, or errors if the source errors.

**Operator behavior:** `reduce` folds all source values into one final result and emits only when the source completes.

---



































































































































































