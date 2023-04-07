/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (env) {
  console.log('FE environment:', env)
  return {
    // Only enable env file for development
    enabled: env === 'development',
    clientAllowedKeys: ['FF_BETACODE'],
    fastbootAllowedKeys: [],
    failOnMissingKey: true,
    path: path.join(path.dirname(__dirname), '.env'),
  };
};
