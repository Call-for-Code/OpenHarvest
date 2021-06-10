/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const got = require('got');
const { logger } = require('./logger');

const Network = {
  async send(endpoint, query, variables = {}) {
    if (!endpoint) {
      logger.info(
        'No endpoint provided for telemetry to report data. No request was made'
      );
      return;
    }

    await got.post(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      timeout: 1000 * 15,
    });
  },
};

module.exports = {
  Network,
};
