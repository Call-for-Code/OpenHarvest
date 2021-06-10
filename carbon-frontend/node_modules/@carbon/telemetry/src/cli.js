/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const cli = require('yargs');
const packageJson = require('../package.json');
const Telemetry = require('./telemetry');
const Environment = require('./env');
const { hash } = require('./hash');
const { getProjectDetails } = require('./project');

function main({ argv, cwd, env, exit }) {
  const environment = Environment.get();

  cli
    .scriptName(packageJson.name)
    .version(packageJson.version)
    .usage('Usage: $0 [options]');

  cli.command(
    'collect',
    'specify attributes to be collected from consumer projects',
    (yargs) => {
      yargs.options({
        install: {
          describe: 'collect package install and version details',
          type: 'boolean',
        },
        components: {
          describe: 'collect component usage details in project files',
          type: 'boolean',
        },
        dev: {
          describe: '[DEV] specify the package to test in development',
          type: 'string',
        },
        // TODO: implement support for token tracking and override tracking
        // 'tokens': {
        // describe: 'collect token usage in project files',
        // type: 'boolean',
        // },
        // 'style-overrides': {
        // describe: 'collect style overrides in project files',
        // type: 'boolean',
        // },
      });
    },
    async (argv) => {
      const options = {
        install: argv.install,
        components: argv.components,
      };

      if (argv.dev) {
        const pkg = await getPackageDetailsDev(argv.dev, cwd());
        const devEnvironment = {
          isCI: true,
          isPR: false,
          debug: true,
          endpoint: env.CARBON_TELEMETRY_ENDPOINT || null,
          optOut: false,
          packagePath: pkg.directory,
          projectPath: cwd(),
        };
        const project = await getProjectDetails(devEnvironment.projectPath);

        await timeout(Telemetry.run(devEnvironment, project, pkg, options));
      } else {
        // Unable to find projectPath from `postinstall` script
        if (!environment.projectPath) {
          exit(0);
        }

        const project = await getProjectDetails(environment.projectPath);
        const pkg = await getPackageDetails(environment.packagePath);

        await timeout(Telemetry.run(environment, project, pkg, options));
      }

      exit(0);
    }
  );

  cli.fail((message, error) => {
    if (environment.debug) {
      if (error) {
        console.error(error);
      } else {
        console.error(message);
      }
      exit(1);
      return;
    }
    exit(0);
  });

  cli.parse(argv.slice(2)).argv;
}

/**
 * @typedef {PackageDetails}
 * @property {object} packageJson
 * @property {string} packageJson.name
 * @property {string} packageJson.version
 * @property {string} directory
 * @property {string} id
 */

/**
 * Get the package details from a given package path, typically loaded during
 * the post-install step
 * @param {string} packagePath
 * @returns {PackageDetails}
 */
async function getPackageDetails(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  const pkg = {
    packageJson,
    directory: packagePath,
    id: hash(packagePath),
  };
  return pkg;
}

/**
 * Get the details for the given package when developing. This is useful when a
 * developer wants to run the telemetry CLI on their machine on packages cloned
 * from GitHub.
 *
 * This method supports two states of projects:
 * 1. The developer can install all dependencies of the project
 * 2. The developer is unable to install all dependencies of the project
 *
 * In the case of (1) we try and load the exact package.json in the installed
 * node_modules folder, in the case of (2) we infer the minimal version from the
 * project's package.json's dependencies.
 *
 * Both situations are helpful in the case the developer is testing out a
 * project where they may be unable to install dependencies, for example if they
 * don't have access to a specific artifactory instance
 *
 * @param {string} packageName
 * @param {string} cwd
 * @returns {PackageDetails}
 */
async function getPackageDetailsDev(packageName, cwd) {
  try {
    // Try to resolve from an installed location so we can get the most accurate
    // package information
    const packageJsonPath = require.resolve(
      path.join(packageName, 'package.json'),
      {
        paths: [cwd],
      }
    );
    const packageJson = await fs.readJson(packageJsonPath);
    const pkg = {
      packageJson,
      directory: path.dirname(packageJsonPath),
      id: hash(packageJsonPath),
    };
    return pkg;
  } catch (error) {
    // If we run into this `catch` block we most likely received a
    // MODULE_NOT_FOUND error. If not, the error is unexpected and we should
    // throw
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }

    const packageJsonPath = path.join(cwd, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`Unable to find a valid package.json file from ${cwd}`);
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const {
      dependencies = {},
      devDependencies = {},
      peerDependencies = {},
    } = packageJson;
    const allDependencies = [
      ...Object.entries(dependencies),
      ...Object.entries(devDependencies),
      ...Object.entries(peerDependencies),
    ];
    const entry = allDependencies.find(([name, version]) => {
      if (name === packageName) {
        return true;
      }
      return false;
    });
    if (!entry) {
      throw new Error(
        `Unable to find the dependency ${packageName} listed in ${packageJsonPath}`
      );
    }

    const { version } = semver.minVersion(entry[1]);
    const pkg = {
      packageJson: {
        name: packageName,
        version,
      },
      directory: cwd,
      id: hash(cwd),
    };

    return pkg;
  }
}

/**
 * Returns a promise that will either resolve when the given promise resolves or
 * resolves early after the given `ms` duration elapses
 * @param {Promise<T>} promise
 * @param {number} ms
 * @return {Promise<T | null>}
 */
function timeout(promise, ms = 1000 * 60) {
  return Promise.race([promise, wait(ms)]);
}

/**
 * Wait a specified amount of time before resolving the promise
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = main;
