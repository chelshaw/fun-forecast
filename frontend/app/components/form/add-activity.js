import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class FormAddActivityComponent extends Component {
  @service auth;
  @service router;
  @tracked locType = null;
  @tracked selectedActivity = null;

  @action resetForm() {
    this.selectedActivity = null;
    this.locType = null;
  }

  @action saveActivity(evt) {
    evt.preventDefault();
    const { locationKey, locationName } = this.auth.currentUser;
    this.auth.saveActivityToUser({
      ref: `${this.selectedActivity.verb}_${locationKey}`,
      locationKey,
      locationName,
    });
    this.router.transitionTo('home');
  }
}
