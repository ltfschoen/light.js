// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import memoizee from 'memoizee';
import { ReplaySubject } from 'rxjs';

import { withoutLoading } from '../../utils/operators/withoutLoading';

/**
 * Mixins (aka. interface in Java or trait in Rust) that are added into an rpc$
 * Observable.
 *
 * @ignore
 */
const frequencyMixins = {
  /**
   * Change the frequency of a RPC Observable.
   *
   * @param {Array<Observable>} frequency - An array of frequency Observables.
   * @return {Null}
   * @example
   * balanceOf$.setFrequency([onEverySecond$, onStartup$]); // Will fetch
   * balance once on startup, and then every second.
   */
  setFrequency (frequency) {
    // TODO Check that frequency is well-formed

    this.metadata.frequency = frequency;

    // If necessary, we clear the memoize cache
    if (typeof this.clear === 'function') {
      this.clear();
    }
  }
};

/**
 * Add metadata to an rpc$ Observable, and transform it into a ReplaySubject(1).
 *
 * @ignore
 * @param {Object} metadata - The metadata to add.
 * @return {Observable} - The original rpc$ Observable with patched metadata.
 */
const createRpc = (metadata = {}) => source$ => {
  const rpc$ = (...args) => {
    // The last arguments is an options, if it's an object
    // TODO What if we pass a single object as argument, which is not options?
    const options =
      args && args.length && typeof args[args.length - 1] === 'object'
        ? args.pop()
        : {};

    const subject$ = new ReplaySubject(1);
    // The pipes to add, from the options
    const pipes = [];
    if (options.withoutLoading === true) {
      pipes.push(withoutLoading());
    }
    source$(...args)
      .pipe(...pipes)
      .subscribe(subject$);

    return subject$;
  };

  const result$ = memoizee(rpc$);
  Object.assign(result$, frequencyMixins, { metadata });
  return result$;
};

export default createRpc;
