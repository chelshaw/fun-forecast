/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (env) {
  return {
    clientAllowedKeys: ['FF_BETACODE'],
    fastbootAllowedKeys: [],
    failOnMissingKey: true,
    path: path.join(path.dirname(__dirname), '.env'),
    // Vercel doesn't have access to .env file, so disable for env
    enabled: env === 'development',
  };
};
