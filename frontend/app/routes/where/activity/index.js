import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhereActivityIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('where.activity.choose');
  }
}
