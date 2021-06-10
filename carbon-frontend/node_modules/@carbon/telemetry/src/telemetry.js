/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ConfigStore = require('configstore');
const fs = require('fs-extra');
const { collectors } = require('./collect');
const { hash } = require('./hash');
const { logger } = require('./logger');
const { notify } = require('./notify');

const config = new ConfigStore('@carbon/telemetry');

const defaultOptions = {
  install: false,
  components: false,
};

async function run(env, project, pkg, telemetryOptions = {}) {
  if (env.isCI === false) {
    logger.info('@carbon/telemetry is not running in CI, stopping');
    return;
  }

  if (env.isPR === true) {
    logger.info('@carbon/telemetry is running on a Pull Request, stopping');
    return;
  }

  if (env.optOut === true) {
    logger.info('User has opted out of @carbon/telemetry, stopping');
    return;
  }

  if (project.internal === false) {
    logger.info('Project is not internal, stopping');
    return;
  }

  if (project.git === false) {
    logger.info('Project does not use git, stopping');
    return;
  }

  if (project.packageJson.name === pkg.packageJson.name) {
    logger.info(
      '@carbon/telemetry is running on a library repository, stopping'
    );
    return;
  }

  const options = {
    ...defaultOptions,
    ...telemetryOptions,
  };
  const enabledOptions = Object.entries(options)
    .filter(([_name, enabled]) => {
      return enabled;
    })
    .map(([name]) => {
      return name;
    });

  if (enabledOptions.length === 0) {
    logger.info('No options enabled for collection, stopping');
    return;
  }

  const jobId = `${project.id}/${pkg.id}`;
  if (config.get(jobId)) {
    logger.info('Telemetry already started for job: %s, stopping', jobId);
    return;
  }

  try {
    config.set(jobId, true);

    logger.info(
      'Starting telemetry collection for package %s:v%s in project %s',
      pkg.packageJson.name,
      pkg.packageJson.version,
      project.directory
    );

    notify(env);

    const start = Date.now();

    for (const option of enabledOptions) {
      if (!collectors.has(option)) {
        logger.info('No collector available for option: %s', option);
        continue;
      }

      const collector = collectors.get(option);
      await collector(env, project, pkg);
    }

    logger.info('Completed telemetry in %sms', Date.now() - start);
  } catch (error) {
    logger.error(error);
  } finally {
    config.delete(jobId);
  }
}

module.exports = {
  run,
};
