import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginRoute extends Route {
  @service router;

  @action
  mockLogin() {
    // this.auth.signIn();
    this.router.transitionTo('home');
  }
}
