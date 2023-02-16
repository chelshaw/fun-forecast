import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class VerbLocationRoute extends Route {
  @service api;

  async model(params) {
    const zipcode = params.loc_key;
    const verb = params.verb;
    const dayKey = 'Feb 14';
    const data = await this.api.getActivityByRef(`${verb}_${zipcode}`);
    const hours = data.hours.filter((h) => h.dayKey === dayKey);
    return {
      ...data,
      hours,
      title: `When to ${verb} on ${dayKey}`,
      dayKey,
    };
  }
}
