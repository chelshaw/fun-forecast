import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhereActivityChooseRoute extends Route {
  @service store;

  async maybeGetLocation(locRef) {
    try {
      const foundLocation = await this.store.peekRecord('location', locRef);
      if (!foundLocation) {
        throw new Error('location not found');
      }
      return foundLocation;
    } catch (e) {
      return this.store.findRecord('location', locRef);
    }
  }
  model() {
    const { loc_ref } = this.paramsFor('where.activity');
    return this.maybeGetLocation(loc_ref);
  }
}
