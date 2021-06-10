/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * Conditionally display the banner for notifying users of telemetry collection
 * @param {EnvironmentInfo} env
 */
function notify(env) {
  if (!env.isCI || env.optOut) {
    return;
  }

  if (env.debug) {
    return;
  }

  console.log(`
    Attention: Carbon now collects telemetry data regarding usage for IBM projects.

    This information is used to influence Carbon's roadmap and prioritize bug fixes.

    You can opt-out of this process by setting CARBON_TELEMETRY_DISABLED=1 in
    your environment.
`);
}

module.exports = {
  notify,
};
