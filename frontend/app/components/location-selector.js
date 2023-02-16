import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LocationSelectorComponent extends Component {
  @service local;
  @service router;
  @tracked zipcode = '';

  constructor() {
    super(...arguments);
    const location = this.local.getItem(`loc`);
    if (location) {
      this.zipcode = location.zipcode;
    }
  }

  @action saveLocation(evt) {
    evt.preventDefault();
    if (!this.zipcode) return;
    // TODO: check if location is valid
    console.log('Saving mock location');
    const location = {
      city: 'San Marcos',
      state: 'TX',
      zipcode: this.zipcode,
      lat: 32.83,
      lng: -72.4983,
    };
    this.local.setItem(`loc`, location);
    this.router.transitionTo('where.activity.choose', this.zipcode);
    if (this.args.onSave) {
      this.args.onSave(location);
    }
  }
}
