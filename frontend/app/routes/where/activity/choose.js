import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhereActivityChooseRoute extends Route {
  @service location;

  model() {
    const { loc_ref } = this.paramsFor('where.activity');
    // TODO: Handle error case if cannot find location
    return this.location.getById(loc_ref);
  }
}
