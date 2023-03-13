import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class WhereChooseController extends Controller {
  @service router;
  @service location;

  @action onLocationSelect(locData) {
    this.location.add(locData);
    this.router.transitionTo('where.activity.choose', { loc_ref: locData.id });
  }
}
