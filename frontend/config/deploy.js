/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary in order to run ember-cli-deploy-cloudfront.
      // To disable CloudFront invalidation, remove this setting or change it to `false`.
      // To disable ember-cli-deploy-cloudfront for only a particular environment, add
      // `ENV.pipeline.activateOnDeploy = false` to an environment conditional below.
      activateOnDeploy: true,
    },
    s3: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      filePattern: '*',
    },
    cloudfront: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
  };

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    ENV.s3.bucket = process.env.STAGING_BUCKET;
    ENV.s3.region = process.env.AWS_REGION;
    // Staging env doesn't use cloudfront
    ENV.pipeline.activateOnDeploy = false
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV.s3.bucket = process.env.PROD_BUCKET;
    ENV.s3.region = process.env.AWS_REGION;
    ENV.cloudfront.distribution = process.env.PROD_DISTRIBUTION;
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
