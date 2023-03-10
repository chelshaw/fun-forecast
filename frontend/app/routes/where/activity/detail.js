import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { DateTime } from 'luxon';

const DATE_FORMAT = 'yyyy-MM-dd';
export default class WhereActivityDetailRoute extends Route {
  @service api;
  @service location;
  @service router;

  beforeModel() {
    const { loc_ref } = this.paramsFor('where.activity');
    const location = this.location.getById(loc_ref);
    if (!location) {
      return this.router.transitionTo('where.choose');
    }
  }

  async model(params, transition) {
    const { loc_ref } = this.paramsFor('where.activity');
    const { verb } = params;
    const loc = this.getLocationDetails(loc_ref);
    const whenDate = this.parseDateFromParam(transition.to.queryParams.when);
    const data = await this.api.singleActivity(
      verb,
      loc,
      whenDate.toFormat(DATE_FORMAT)
    );
    return {
      data,
      location: loc,
      when: whenDate.toRelativeCalendar(),
    };
  }

  parseDateFromParam(whenParam) {
    const now = DateTime.now();
    if (!whenParam && now.hour > 19) {
      return now.plus({ days: 1 });
    } else if (!whenParam) {
      return now;
    }
    const whenInt = parseInt(whenParam, 10);
    if (isNaN(whenInt) || whenInt > 2) {
      // TODO: only paid can see future?
      return now;
    }
    return now.plus({ days: whenInt });
  }

  getLocationDetails(locId) {
    const location = this.location.getById(locId);
    if (undefined === location) {
      throw new Error('No location found');
    }
    return location;
  }
}
