import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhereIndexRoute extends Route {
  @service router;
  beforeModel() {
    console.log('redirect from where');
    this.router.transitionTo('where.choose');
  }
}
