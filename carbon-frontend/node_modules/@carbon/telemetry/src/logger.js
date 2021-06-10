/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { createLogger, format, transports } = require('winston');

const {
  LOG_LEVEL = 'info',
  NODE_ENV = 'development',
  CARBON_TELEMETRY_DEBUG,
} = process.env;
const { combine, errors, label, prettyPrint, splat, timestamp } = format;

const logger = createLogger({
  silent: !CARBON_TELEMETRY_DEBUG,
  level: LOG_LEVEL,
  format: combine(
    label({ label: 'carbon.telemetry' }),
    splat(),
    timestamp(),
    errors({ stack: true }),
    prettyPrint()
  ),
  transports: [new transports.Console()],
});

module.exports = {
  logger,
};
