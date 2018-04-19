// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import { publishReplay, refCount, filter, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { timer } from 'rxjs/observable/timer';

import api from '../api';

/**
 * Observable that emits each time accounts change.
 */
export const onAccountsChanged$ = Subject.create().pipe(startWith(0));
onAccountsChanged$.metadata = { name: 'onAccountsChanged$' };

/**
 * Observable that emits on every new block.
 */
export const onEveryBlock$ = Observable.create(observer => {
  const subscription = api.pubsub.eth.blockNumber((error, result) => {
    if (error) {
      observer.error(error);
    } else {
      observer.next(+result);
    }
  });
  return () =>
    subscription.then(subscriptionId => api.pubsub.unsubscribe(subscriptionId));
}).pipe(startWith(0), publishReplay(1), refCount());
onEveryBlock$.metadata = { name: 'onEveryBlock$' };

/**
 * Observable that emits on every 2nd block.
 */
export const onEvery2Blocks$ = onEveryBlock$.pipe(
  filter(n => n % 2 === 0), // Around ~30s on mainnet
  publishReplay(1),
  refCount()
);
onEvery2Blocks$.metadata = { name: 'onEvery2Blocks$' };

/**
 * Observable that emits on every 4th block.
 */
export const onEvery4Blocks$ = onEveryBlock$.pipe(
  filter(n => n % 4 === 0), // Around ~1min on mainnet
  publishReplay(1),
  refCount()
);
onEvery4Blocks$.metadata = { name: 'onEvery4Blocks$' };

/**
 * Observable that emits on every second.
 */
export const onEverySecond$ = timer(0, 1000);
onEverySecond$.metadata = { name: 'onEverySecond$' };

/**
 * Observable that emits on every other second.
 */
export const onEvery2Seconds$ = timer(0, 2000);
onEvery2Seconds$.metadata = { name: 'onEvery2Seconds$' };

/**
 * Observable that emits only once.
 */
export const onlyAtStartup$ = of(0).pipe(publishReplay(1), refCount());
onlyAtStartup$.metadata = { name: 'onlyAtStartup$' };
