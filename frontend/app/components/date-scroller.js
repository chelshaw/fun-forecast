import Component from '@glimmer/component';
import { DateTime } from 'luxon';
import { daysFromToday } from 'fun-forecast-frontend/utils/dates';

export default class DateScrollerComponent extends Component {
  get currentOffset() {
    return parseInt(this.args.param, 10) || 0;
  }

  get relativeWhen() {
    const start = DateTime.now();
    const dt = daysFromToday(this.currentOffset);
    const { days } = dt.diff(start, 'days').toObject();

    if (days <= 1) {
      return dt.toRelativeCalendar();
    }
    return `${dt.toRelativeCalendar()} (${dt.toFormat('EEE')})`;
  }

  get prevDay() {
    if (this.currentOffset === 0) {
      return null;
    }
    return this.currentOffset - 1;
  }

  get nextDay() {
    const nextParam = this.currentOffset + 1;
    if (nextParam >= this.args.maxDay) return null;
    return nextParam;
  }
}
