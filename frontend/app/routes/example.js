import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { DateTime } from 'luxon';

export default class ExampleRoute extends Route {
  @service api;

  async model() {
    const loc_ref = '78704';
    const verb = 'hike';
    const data = await this.api.generateForecast(verb, loc_ref);
    return {
      data,
      verb,
      where: 'Austin, TX',
      when: 'today',
    };
  }
}
