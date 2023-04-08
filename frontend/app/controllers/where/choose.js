import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class WhereChooseController extends Controller {
  @service router;

  @action onLocationSelect(loc_ref) {
    this.router.transitionTo('where.activity.choose', {
      loc_ref,
    });
  }
}
