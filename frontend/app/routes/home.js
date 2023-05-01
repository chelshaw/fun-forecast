import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class HomeRoute extends Route {
  @service api;
  @service storage;
  @service store;

  beforeModel() {
    this.storage.loadFromLocal();
  }

  model() {
    const locations = this.store.peekAll('location');
    if (locations.length) {
      const verbs = ['golf', 'run', 'picnic'];
      return this.api.getMultipleActivities(verbs, locations[0]);
    }
    return [];
  }
}
