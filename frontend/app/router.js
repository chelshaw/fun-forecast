import EmberRouter from '@ember/routing/router';
import config from 'ff-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '/' });

  this.route('example');
  this.route('access-denied');

  this.route('where', function () {
    this.route('choose');
    this.route('activity', { path: ':loc_ref/to' }, function () {
      this.route('choose');
      this.route('detail', { path: ':verb' });
    });
  });
});
