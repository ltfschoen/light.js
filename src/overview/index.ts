// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import * as rpc from '../rpc';

/**
 * Add a property on window, so that the subscribed object can be viewed in the
 * JS console via `window.parity.rpcOverview()`
 */
if (typeof window !== 'undefined') {
  // == null means null or undefined
  if (window.parity == null) {
    window.parity = {};
  }

  Object.assign(window.parity, {
    rpcOverview() {
      const overview = {};
      Object.keys(rpc).forEach(key => {
        const rpc$ = rpc[key];

        // If there are subscribers, then we add
        overview[key] = { ...rpc$.metadata };

        // We make the `calledWith` field human-readable
        if (rpc$.metadata.calledWith) {
          Object.keys(rpc$.metadata.calledWith).map(calledWithKey => {
            const subject$ = rpc$.metadata.calledWith[calledWithKey];
            overview[key].calledWith[calledWithKey] = {
              currentValue: subject$._events && subject$._events[0],
              subscribersCount: subject$.observers.length
            };
          });
        }

        // We make the `frequency` field human-readable
        if (rpc$.metadata.frequency) {
          overview[key].frequency = rpc$.metadata.frequency.map(
            frequency$ => frequency$.metadata.name
          );
        }

        // We remove all the metadata keys that are null, empty or functions,
        // for clarity while console.logging it.
        Object.keys(overview[key]).forEach(innerKey => {
          if (
            !overview[key][innerKey] ||
            (Array.isArray(overview[key][innerKey]) &&
              !overview[key][innerKey].length) ||
            typeof overview[key][innerKey] === 'function'
          ) {
            delete overview[key][innerKey];
          }
        });
      });

      return overview;
    }
  });
}