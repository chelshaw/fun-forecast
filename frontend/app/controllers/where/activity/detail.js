import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { daysFromToday, DATE_FORMAT } from 'fun-forecast-frontend/utils/dates';

export default class WhereActivityDetailController extends Controller {
  queryParams = ['when'];
  maxDates = 7;

  @tracked when = 0;

  @tracked model;

  calcWhen(whenParam) {
    // TODO: some people have access to more dates?
    const errorOnDatesExceed = this.maxDates;
    if (whenParam > errorOnDatesExceed) {
      throw new Error(
        `Sorry, date is too far in the future to calculate at this time.`
      );
    }
    return daysFromToday(whenParam, 19);
  }

  get filteredHours() {
    let whenParam = this.when;
    let model = this.model;

    const date = this.calcWhen(whenParam);
    const whenDate = date.toFormat(DATE_FORMAT);
    return model.forecast.filter((h) => h.start.startsWith(whenDate));
  }
}
