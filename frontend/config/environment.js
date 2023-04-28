'use strict';

module.exports = function (environment) {
  console.log('config env:', environment);
  const ENV = {
    modulePrefix: 'fun-forecast-frontend',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      betacode: process.env.FF_BETACODE,
      apiBase: 'http://localhost:4200',
      contentSecurityPolicy: {
        'connect-src': "'self' https://api.myfunforecast.com",
      },
    },

    metricsAdapters: [
      {
        name: 'SimpleAnalytics',
        environments: ['production'],
        config: {
          hostname: 'beta.myfunforecast.com',
          // Uncomment below to use custom source
          // src: 'sa.beta.myfunforecast.com/latest.js',
        },
      },
    ],
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    // ENV.APP.USE_MOCK = true;
    ENV.contentSecurityPolicy = {
      // ... other stuff here
      'connect-src':
        "'self' http://localhost:5001 http://api.myfunforecast.com http://load-balancer-for-ff-backend-1719466983.us-east-1.elb.amazonaws.com",
    };
    ENV.APP.apiBase = 'http://localhost:5001';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.APP.apiBase = 'https://api.myfunforecast.com';
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' https://api.myfunforecast.com",
    };
  }

  return ENV;
};
