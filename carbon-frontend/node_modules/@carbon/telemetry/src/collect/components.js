/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const parser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const fs = require('fs-extra');
const glob = require('fast-glob');
const path = require('path');
const { logger } = require('../logger');
const { Network } = require('../network');

async function components(env, project, pkg) {
  const projectFiles = await glob(['**/*.{js,jsx,ts,tsx}'], {
    cwd: project.directory,
    ignore: [
      '**/es/**',
      '**/umd/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/*.min.js',
    ],
  }).then((relativePaths) => {
    return relativePaths.map((relativePath) => {
      return {
        filepath: path.join(project.directory, relativePath),
        relativePath,
      };
    });
  });

  const metadata = await collect(projectFiles, pkg, env);
  const query = `
    mutation CollectFileDetails($input: CollectFileDetailsInput!) {
      collectFileDetails(input: $input) {
        job {
          done
        }
      }
    }
  `;
  const input = {
    project: {
      id: project.id,
      remote: project.remote,
      commit: project.commit,
    },
    package: {
      name: pkg.packageJson.name,
      version: pkg.packageJson.version,
    },
    files: Array.from(metadata)
      .filter((fileInfo) => {
        return fileInfo.components.length > 0;
      })
      .map((fileInfo) => {
        return {
          relativePath: fileInfo.relativePath,
          components: fileInfo.components,
        };
      }),
  };

  await Network.send(env.endpoint, query, {
    input,
  });
}

const filetypes = new Map([
  ['.js', 'JavaScript'],
  ['.jsx', 'JavaScript'],
  ['.ts', 'TypeScript'],
  ['.tsx', 'TypeScript'],
]);

/**
 * Collect metadata from the given set of files for the given package
 * @param {Array<object} files
 * @param {object} pkg
 * @param {object} env
 * @returns {Set}
 */
async function collect(files, pkg, env) {
  const metadata = new Set();

  for (const file of files) {
    try {
      const type = filetypes.get(path.extname(file.filepath));
      const contents = await fs.readFile(file.filepath, 'utf8');
      const ast = parse(type, contents);
      const imports = collectPackageImports(pkg, type, ast);
      const info = {
        ...file,
        type,
        components: imports
          .filter(isReactComponentImport)
          .map(collectReactComponentInfo),
      };

      metadata.add(info);
    } catch (error) {
      if (env.debug) {
        error.file = file.relativePath;
        logger.error(error);
      }
    }
  }

  return metadata;
}

/**
 * Parse the given file type and content into an AST
 * @param {string} type
 * @param {string} content
 * @returns {object}
 */
function parse(type, content) {
  const defaultPlugins = [
    // Language
    'jsx',

    // Proposal
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'decorators-legacy',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'importMeta',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    'topLevelAwait',
  ];

  if (type === 'TypeScript') {
    return parser.parse(content, {
      sourceType: 'module',
      plugins: [...defaultPlugins, 'typescript'],
    });
  }

  if (type === 'JavaScript') {
    return parser.parse(content, {
      sourceType: 'module',
      plugins: [...defaultPlugins, 'flow'],
    });
  }

  throw new Error(`Unsupported type for parsing: ${type}`);
}

function collectPackageImports(pkg, type, ast) {
  // Non-JavaScript or TypeScript files are currently unsupported. In the future
  // we may offer support for Sass imports
  if (type !== 'JavaScript' && type !== 'TypeScript') {
    return [];
  }

  const imports = [];

  traverse(ast, {
    ImportDeclaration(path) {
      // We currently don't support analytics around importing
      // types, like in TypeScript, so we filter off imports that aren't of
      // type "value"
      if (path.node.importKind !== 'value') {
        return;
      }

      if (!path.node.source.value.includes(pkg.packageJson.name)) {
        return;
      }

      for (const specifier of path.node.specifiers) {
        const importInfo = {
          source: path.node.source.value,
          binding: path.scope.getOwnBinding(specifier.local.name),
        };

        if (specifier.type === 'ImportSpecifier') {
          importInfo.identifier = specifier.imported.name;
          importInfo.default = false;
          importInfo.key = `${importInfo.source}/${importInfo.identifier}`;
        } else {
          importInfo.identifier = specifier.local.name;
          importInfo.default = true;
          importInfo.key = `${importInfo.source}/default`;
        }

        imports.push(importInfo);
      }
    },
  });

  return imports;
}

function isReactComponentImport(importInfo) {
  return importInfo.binding.referencePaths.some((path) => {
    if (path.node.type === 'JSXClosingElement') {
      return false;
    }

    if (path.parentPath.node.type === 'JSXOpeningElement') {
      return true;
    }

    return false;
  });
}

function collectReactComponentInfo(importInfo) {
  const { binding, source, identifier, key } = importInfo;
  const references = binding.referencePaths
    .filter((path) => {
      return path.parentPath.node.type === 'JSXOpeningElement';
    })
    .map((path) => {
      return {
        attributes: path.parentPath.node.attributes
          .filter((attribute) => {
            if (attribute.type !== 'JSXAttribute') {
              return false;
            }
            return true;
          })
          .map((attribute) => {
            const prop = { name: attribute.name.name };

            // Supports short-hand props like <Component isUpperCase />
            if (!attribute.value) {
              prop.value = {
                type: 'BooleanLiteral',
                value: 'true',
              };
              return prop;
            }

            if (attribute.value.type === 'StringLiteral') {
              prop.value = {
                type: 'StringLiteral',
                value: attribute.value.value,
              };
              return prop;
            }

            prop.value = {
              type: attribute.value.expression.type,
            };

            switch (attribute.value.expression.type) {
              case 'BooleanLiteral':
              case 'NumericLiteral':
              case 'StringLiteral':
                prop.value.value = '' + attribute.value.expression.value;
                break;
              case 'Identifier':
                prop.value.value = attribute.value.expression.name;
                break;
            }

            return prop;
          }),
      };
    });

  return {
    source,
    identifier,
    key,
    default: importInfo.default,
    references,
  };
}

module.exports = components;
