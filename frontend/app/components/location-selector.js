import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LocationSelectorComponent extends Component {
  @service local;
  @service router;
  @tracked zipcode = '';

  @action saveLocation(evt) {
    evt.preventDefault();
    // TODO: check if location is valid
    if (!this.zipcode) return;
    if (this.args.verb) {
      return this.router.transitionTo(
        'where.activity.details',
        this.zipcode,
        this.args.verb
      );
    }
    this.router.transitionTo('where.activity.choose', this.zipcode);
    if (this.args.onSave) {
      this.args.onSave(location);
    }
  }
}
