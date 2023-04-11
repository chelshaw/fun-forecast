import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { DateTime } from 'luxon';
import { daysFromToday } from 'fun-forecast-frontend/utils/dates';

const MAX_DATE = 10;
export default class WhereActivityDetailRoute extends Route {
  @service api;
  @service router;
  @service store;

  calcWhen(whenParam) {
    // TODO: some people have access to more dates?
    const errorOnDatesExceed = MAX_DATE;
    if (whenParam > errorOnDatesExceed) {
      throw new Error(
        `Sorry, date is too far in the future to calculate at this time.`
      );
    }
    return daysFromToday(whenParam, 19);
  }

  relativeWhen(dt) {
    const start = DateTime.now();
    const { days } = dt.diff(start, 'days').toObject();

    if (days <= 1) {
      return dt.toRelativeCalendar();
    }
    return `${dt.toRelativeCalendar()} (${dt.toFormat('EEE')})`;
  }

  async model(params) {
    const { verb } = params;
    const { loc_ref } = this.paramsFor('where.activity');
    // TODO: get model from parent route?
    const location = await this.store.findRecord('location', loc_ref);
    const { forecast } = await this.api.singleActivity(verb, loc_ref);
    return {
      verb,
      location,
      forecast,
    };
  }
}
