/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (/* env */) {
  return {
    clientAllowedKeys: [],
    fastbootAllowedKeys: [],
    failOnMissingKey: true,
    enabled: env !== 'production',
    path: path.join(path.dirname(__dirname), '.env'),
  };
};
