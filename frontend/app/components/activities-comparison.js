import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { DateTime } from 'luxon';
import { DATE_FORMAT } from 'fun-forecast-frontend/utils/dates';

export default class ActivitiesComparisonComponent extends Component {
  @tracked rangeValue = 50;
  @tracked chosenDate = DateTime.now();

  get currentDate() {
    return this.chosenDate.toFormat(DATE_FORMAT);
  }
  get relativeWhen() {
    return this.chosenDate.toRelativeCalendar();
  }
  get verbsDomain() {
    return this.args.activities.map((a) => a.verb);
  }
  get verbsRange() {
    return this.args.activities.map((_, idx) => idx * 20);
  }
  get timeDomain() {
    return [
      this.chosenDate.startOf('day').toJSDate(),
      this.chosenDate.endOf('day').toJSDate(),
    ];
  }
  get midpoint() {
    return this.rangeValue / 100;
  }

  @action handleRangeChange(evt) {
    this.rangeValue = evt.target.value;
  }

  @action updateDate(direction) {
    this.chosenDate = this.chosenDate.plus({ days: direction });
  }

  get hours() {
    let flattened = [];
    this.args.activities.forEach(({ verb, evaluated_hours }) => {
      console.log(
        'calc hours',
        verb,
        evaluated_hours.map((e) => e.score).join('::')
      );
      const byVerb = evaluated_hours.map((h) => ({
        ...h,
        timestamp: DateTime.fromISO(h.start, { setZone: true }),
        jsDate: DateTime.fromISO(h.start, { setZone: true }).toJSDate(),
        verb,
      }));
      flattened = flattened.concat(byVerb);
    });
    return flattened;
    // .filter((h) => this.chosenDate.hasSame(h.timestamp, 'day'));
  }
}
