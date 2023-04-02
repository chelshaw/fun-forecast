import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ExampleRoute extends Route {
  @service api;

  async model() {
    const verb = 'hike';
    const data = await this.api.generateForecast(verb, false);
    return {
      data,
      verb,
      where: 'Austin, TX',
      when: 'today',
      location: {
        lat: 30.2711,
        lng: -97.7437,
        name: 'San Marcos',
      }
    };
  }
}
