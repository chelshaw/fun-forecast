import Route from '@ember/routing/route';
import { verb_icons } from '../../utils/verbs';

export default class MeAddRoute extends Route {
  model() {
    const activeActivities = ['hike', 'motorcycle'];
    return Object.keys(verb_icons).map((verb) => ({
      verb,
      icon: verb_icons[verb],
      active: activeActivities.includes(verb),
    }));
  }
}
