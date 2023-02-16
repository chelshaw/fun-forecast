import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhereActivityDetailRoute extends Route {
  @service api;

  async model(params) {
    const { loc_ref } = this.paramsFor('where.activity');
    const { verb } = params;
    const mocked = this.api.generateForecast(verb, loc_ref);
    const dayKey = 'Feb 14';
    const data = await this.api.getActivityByRef(`${verb}_${loc_ref}`);
    const hours = data.hours.filter((h) => h.dayKey === dayKey);
    return {
      ...data,
      hours,
      verb,
      zipcode: loc_ref,
      mocked,
    };
  }
}
