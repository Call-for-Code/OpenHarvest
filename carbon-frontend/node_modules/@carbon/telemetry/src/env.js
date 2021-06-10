/**
 * Copyright IBM Corp. 2020, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ci = require('ci-info');
const fs = require('fs-extra');
const path = require('path');

/**
 * The default endpoint for network requests
 * @type {string}
 */
const defaultEndpoint = 'https://ibm.carbondesignsystem.com/graphql';

/**
 * @typedef EnvironmentInfo
 * @property {boolean} isCI specifies whether the process is being run in CI
 * @property {boolean} isPR specifies whether the process is being run as part
 * of a Pull Request in CI
 * @property {boolean} debug specifies whether telemetry should be run in debug
 * mode or not
 * @property {string} endpoint the graphql collection endpoint
 * @property {boolean} optOut specifies whether the project owner has disabled
 * telemetry
 * @property {string} projectPath the path to the project
 * @property {string} packagePath the path to the package for which we are
 * collecting usage data
 */

/**
 * Get the environment info for the given process
 * @param {object} env
 * @returns {EnvironmentInfo}
 */
function get(env = process.env) {
  const {
    CARBON_TELEMETRY_DEBUG,
    CARBON_TELEMETRY_DISABLED,
    CARBON_TELEMETRY_ENDPOINT,
    INIT_CWD,
  } = env;

  const cwd = process.cwd();
  const debug = !!CARBON_TELEMETRY_DEBUG;
  let endpoint = null;

  if (CARBON_TELEMETRY_ENDPOINT) {
    endpoint = CARBON_TELEMETRY_ENDPOINT;
  } else if (debug) {
    endpoint = 'http://localhost:3000/graphql';
  } else {
    endpoint = defaultEndpoint;
  }

  let projectPath = INIT_CWD;
  // Reference: https://github.com/npm/cli/issues/2033
  // In the newest versions of `npm`, INIT_CWD is currently not available
  if (!projectPath) {
    const paths = cwd.split('node_modules');
    const root = path.resolve(paths[0]);
    const packageJsonPath = path.join(root, 'package.json');

    // This is our best guess to find the "root" package.json path for the
    // application that has installed this package
    if (fs.existsSync(packageJsonPath)) {
      projectPath = root;
    }
  }

  return {
    isCI: ci.isCI,
    isPR: ci.isPR,
    debug,
    endpoint,
    optOut: !!CARBON_TELEMETRY_DISABLED,
    packagePath: process.cwd(),
    projectPath,
  };
}

module.exports = {
  get,
};
