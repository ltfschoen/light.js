"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onSyncingChanged$ = exports.onNodeHealthChanged$ = void 0;

var _api = _interopRequireDefault(require("../api"));

var _createOnFromPubsub = _interopRequireDefault(require("./utils/createOnFromPubsub"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

/**
 * Observable that emits when syncing status changes.
 */
var onNodeHealthChanged$ = (0, _createOnFromPubsub.default)('parity_nodeHealth', _api.default);
exports.onNodeHealthChanged$ = onNodeHealthChanged$;
onNodeHealthChanged$.metadata = {
  name: 'onNodeHealthChanged$'
};
/**
 * Observable that emits when syncing status changes.
 */

var onSyncingChanged$ = (0, _createOnFromPubsub.default)('eth_syncing', _api.default);
exports.onSyncingChanged$ = onSyncingChanged$;
onSyncingChanged$.metadata = {
  name: 'onSyncingChanged$'
};