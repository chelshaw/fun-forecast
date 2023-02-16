import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class FormLoginComponent extends Component {
  @service router;

  @action
  mockLogin() {
    // this.auth.signIn();
    this.router.transitionTo('home');
  }
}
