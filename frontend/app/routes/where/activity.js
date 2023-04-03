import Route from '@ember/routing/route';
import { allActivities } from '../../utils/verbs';

export default class WhereAddRoute extends Route {
  model() {
    return allActivities;
  }
}
