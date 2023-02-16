import EmberRouter from '@ember/routing/router';
import config from 'fun-forecast-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '/' });
  this.route('verbs', { path: 'lets-go' });
  this.route('verb', { path: 'go/:verb' }, function () {
    this.route('location', { path: 'in/:loc_key' });
  });

  this.route('join');
  this.route('login');
  this.route('logout');
  this.route('me', { path: 'i' }, function () {
    this.route('add', function () {
      this.route('verb');
    });
    this.route('activity', { path: 'go/:activity_id' });
  });
  this.route('where', function () {
    this.route('choose');
    this.route('activity', { path: ':loc_ref/to' }, function () {
      this.route('choose');
      this.route('detail', { path: ':verb' });
    });
  });
});
