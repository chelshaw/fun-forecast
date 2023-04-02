import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import exampleForecastResponse from 'fun-forecast-frontend/utils/example-forecast-response';

export default class ExampleRoute extends Route {
  @service api;

  async model() {
    const verb = 'hike';
    const {evaluated_hours} = exampleForecastResponse;
    return {
      data: {
        verb,
        forecast: evaluated_hours,
      },
      verb,
      where: 'Austin, TX',
      when: 'today',
      location: {
        lat: 30.2711,
        lng: -97.7437,
        name: 'Austin',
      }
    };
  }
}
