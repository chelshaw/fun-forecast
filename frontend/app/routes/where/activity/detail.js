import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { DateTime } from 'luxon';
import { daysFromToday, DATE_FORMAT } from 'ff-frontend/utils/dates';

const MAX_DATE = 10;
export default class WhereActivityDetailRoute extends Route {
  @service api;
  @service location;
  @service router;

  queryParams = {
    when: {
      refreshModel: true,
    },
  };

  beforeModel() {
    const { loc_ref } = this.paramsFor('where.activity');
    const location = this.location.getById(loc_ref);
    if (!location) {
      return this.router.transitionTo('where.choose');
    }
  }

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

  async model(params, transition) {
    const { verb } = params;
    const { loc_ref } = this.paramsFor('where.activity');
    const location = this.getLocationDetails(loc_ref);
    const whenDate = this.calcWhen(transition.to.queryParams.when);
    const when = this.relativeWhen(whenDate);
    const data = await this.api.singleActivity(
      verb,
      location,
      whenDate.toFormat(DATE_FORMAT)
    );
    return {
      location,
      when,
      data,
      dayParam: transition.to.queryParams.when || 0,
      maxDay: MAX_DATE,
    };
  }

  getLocationDetails(locId) {
    const location = this.location.getById(locId);
    if (undefined === location) {
      throw new Error('No location found');
    }
    return location;
  }
}
