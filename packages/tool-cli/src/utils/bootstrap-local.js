// 'use strict';
/* eslint-disable */
const debug = require('debug')
const debugLocal = debug('@cli:local')
const debugBuildTs = debug('@cli:local:build-ts')

const fs = require('fs')
const path = require('path')
const ts = require('typescript')
/* eslint-enable */
debugLocal('starting bootstrap local')

// This processes any extended configs
const compilerOptions = ts.getParsedCommandLineOfConfigFile(
  path.join(__dirname, '../../tsconfig-test.json'),
  {},
  ts.sys
).options

// const oldRequireTs = require.extensions['.ts'];
require.extensions['.ts'] = function (m, filename) {
  // If we're in node module, either call the old hook or simply compile the
  // file without transpilation. We do not touch node_modules/**
  // if (filename.match(/node_modules/)) {
  //   if (oldRequireTs) {
  //     return oldRequireTs(m, filename);
  //   }
  //   return m._compile(fs.readFileSync(filename), filename);
  // }
  debugBuildTs(filename)

  // Node requires all require hooks to be sync.
  const source = fs.readFileSync(filename).toString()

  try {
    const result = ts.transpile(source, compilerOptions, filename)

    debugBuildTs('done')

    // Send it to node to execute.
    return m._compile(result, filename)
  } catch (err) {
    console.error('Error while running script "' + filename + '":')
    console.error(err.stack)
    throw err
  }
}
