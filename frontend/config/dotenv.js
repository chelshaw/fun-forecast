/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (env) {
  return {
    clientAllowedKeys: [],
    fastbootAllowedKeys: [],
    failOnMissingKey: true,
    path: path.join(path.dirname(__dirname), '.env'),
    // Allows this to run in Vercel
    enabled: env !== 'production',
  };
};
