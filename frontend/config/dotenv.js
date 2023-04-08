/* eslint-env node */

'use strict';

const path = require('path');

// dotenv doesn't respect environment from ember-cli-deploy
// https://github.com/fivetanley/ember-cli-dotenv/issues/46
module.exports = function () {
  // We only want to use dotenv in local envs, so we will export
  // FF_LOCAL_DEPLOY=1 which will set enabled to true
  const localDeploy = !!process.env.FF_LOCAL_DEPLOY;
  console.log('using local env', localDeploy);

  return {
    // Only enable env file for development
    enabled: localDeploy,
    clientAllowedKeys: ['FF_BETACODE'],
    fastbootAllowedKeys: [],
    failOnMissingKey: true,
    path: path.join(path.dirname(__dirname), '.env'),
  };
};
