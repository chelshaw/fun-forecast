import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhereActivityDetailRoute extends Route {
  @service api;

  model(params) {
    const { loc_ref } = this.paramsFor('where.activity');
    const { verb } = params;
    return this.api.singleActivity(verb, loc_ref);
  }
}
