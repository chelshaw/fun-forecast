import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class WhereActivityChooseController extends Controller {
  @service router;

  @action handleActivitySelect(activity, loc_ref) {
    this.router.transitionTo('where.activity.detail',
      loc_ref,
      activity.verb,
    );
  }
}
