/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const install = require('./install');
const components = require('./components');

const collectors = new Map([
  ['install', install],
  ['components', components],
]);

module.exports = {
  collectors,
};
