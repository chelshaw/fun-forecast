import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class HomeRoute extends Route {
  @service auth;
  @service api;

  async model() {
    const mocked = this.api.generateForecast();
    console.log({ mocked });
    return {
      activities: this.auth.currentUser?.activities?.map((raw) => ({
        ...raw,
        verb: raw.ref.split('_')[0],
      })),
      mocked,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('currentUser', this.auth.currentUser);
  }
}
