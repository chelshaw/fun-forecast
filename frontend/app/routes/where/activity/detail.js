import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { DateTime } from 'luxon';

const DATE_FORMAT = 'yyyy-MM-dd';
export default class WhereActivityDetailRoute extends Route {
  @service api;

  parseDateFromParam(whenParam) {
    const now = DateTime.now();
    console.log({ whenParam });
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

  async model(params, transition) {
    const { loc_ref } = this.paramsFor('where.activity');
    const { verb } = params;
    const whenDate = this.parseDateFromParam(transition.to.queryParams.when);
    console.log({
      format: whenDate.toFormat(DATE_FORMAT),
      rel: whenDate.toRelativeCalendar(),
    });
    const data = await this.api.singleActivity(
      verb,
      loc_ref,
      whenDate.toFormat(DATE_FORMAT)
    );
    return {
      data,
      when: whenDate.toRelativeCalendar(),
    };
  }
}
