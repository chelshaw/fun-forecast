import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { DateTime } from 'luxon';
import { daysFromToday, DATE_FORMAT } from 'fun-forecast-frontend/utils/dates';

const MAX_DATE = 10;
export default class WhereActivityDetailRoute extends Route {
  @service api;
  @service location;
  @service router;
  @service store;

  queryParams = {
    when: {
      refreshModel: true,
    },
  };

  async maybeGetLocation(locRef) {
    try {
      const foundLocation = await this.store.peekRecord('location', locRef);
      if (!foundLocation) {
        throw new Error('location not found');
      }
      return foundLocation;
    } catch (e) {
      return this.store.findRecord('location', locRef);
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
    // If location doesn't exist we redirect before we get here
    const location = await this.maybeGetLocation(loc_ref); 
    const whenDate = this.calcWhen(transition.to.queryParams.when);
    const when = this.relativeWhen(whenDate);
    const data = await this.api.singleActivity(
      verb,
      loc_ref,
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
}
