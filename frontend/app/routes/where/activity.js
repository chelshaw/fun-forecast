import Route from '@ember/routing/route';
import { verb_icons } from '../../utils/verbs';

export default class WhereAddRoute extends Route {
  model() {
    return Object.keys(verb_icons).map((verb) => ({
      verb,
      icon: verb_icons[verb],
      active: true,
    }));
  }
}
