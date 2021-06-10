/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { Network } = require('../network');

async function install(env, project, pkg) {
  const query = `
    mutation PackageInstall($input: PackageInstallInput!) {
      packageInstall(input: $input) {
        job {
          done
        }
      }
    }
  `;
  const input = {
    package: {
      name: pkg.packageJson.name,
      version: pkg.packageJson.version,
    },
    project: {
      id: project.id,
      remote: project.remote,
      commit: project.commit,
    },
  };

  await Network.send(env.endpoint, query, {
    input,
  });
}

module.exports = install;
