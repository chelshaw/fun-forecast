import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { verb_icons } from '../utils/verbs';

export default class VerbRoute extends Route {
  @service auth;
  @service api;

  beforeModel(transition) {
    if (transition.to.params.loc_key) {
      return;
    }
    const zipcode = localStorage.getItem(`FFF_loc`);
    if (zipcode) {
      this.transitionTo('verb.location', zipcode);
    }
  }

  async model(params) {
    if (!Object.keys(verb_icons).includes(params.verb)) {
      // TODO: track new verbs
      throw new Error(`We don't know how to ${params.verb} yet`);
    }
    return {
      verb: params.verb,
    };
  }
}
