/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { hash } = require('./hash');
const { logger } = require('./logger');

/**
 * @typedef Project
 * @property {string} commit the most recent commit for the project
 * @property {string} directory the location of the project
 * @property {string} id the unique id for the project
 * @property {boolean} internal specify whether the project is internal to IBM
 * or external
 * @property {string} remote the git remote of the project, only used for
 * IBM projects
 * @property {object} packageJson the contents of the project's package.json
 */

// We only track remotes related to IBM or Carbon properties
const remotes = [
  'github.ibm.com',
  'github.com/carbon-design-system',
  'github.com/ibm',
];

/**
 * Get the details for the project at the given project path
 * @param {string} directory
 * @returns {Project}
 */
async function getProjectDetails(directory) {
  const packageJsonPath = path.join(directory, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  const project = {
    commit: null,
    directory,
    git: false,
    internal: false,
    packageJson,
    remote: null,
  };

  try {
    const buffer = execSync('git config --local --get remote.origin.url', {
      timeout: 1000,
      stdio: 'pipe',
    });
    const remote = String(buffer).trim();
    const trackedRemote = remotes.find((trackedRemote) => {
      return remote.includes(trackedRemote);
    });

    if (trackedRemote) {
      project.id = hash(remote);
      project.internal = true;
      project.remote = remote;
    } else {
      project.id = hash(directory);
    }

    project.git = true;
  } catch (error) {
    logger.error(error);
  }

  try {
    const buffer = execSync('git rev-parse HEAD', {
      timeout: 1000,
      stdio: 'pipe',
    });
    const commit = String(buffer).trim();
    project.commit = commit;
  } catch (error) {
    logger.error(error);
    project.commit = hash('none');
  }

  return project;
}

module.exports = {
  getProjectDetails,
};
