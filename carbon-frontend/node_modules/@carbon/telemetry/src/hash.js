/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { createHash } = require('crypto');

function hash(payload) {
  const h = createHash('sha256');
  h.update(payload, 'utf8');
  return h.digest('hex');
}

module.exports = {
  hash,
};
