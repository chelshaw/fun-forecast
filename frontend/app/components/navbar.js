import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class NavbarComponent extends Component {
  @service auth;
  @service local;

  @action
  signOut() {
    this.auth.signOut();
  }

  @action
  signIn() {
    this.auth.signIn();
  }

  @action clearStorage() {
    this.local.remove('loc');
  }
}
