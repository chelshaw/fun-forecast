import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service auth;
  @service router;

  beforeModel() {
    this.auth.signOut();
    return this.router.transitionTo('home');
  }
}
