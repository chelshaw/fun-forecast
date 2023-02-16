import Component from '@glimmer/component';
import { DateTime } from 'luxon';

/**
 * @forecast array of forecast data { start, end, score }
 * @sunrise ISO timestamp
 * @sunset ISO timestamp
 */
export default class ForecastDetailComponent extends Component {
  hourHeight = 30;
  pad = 10;
  dayInfoSpace = 60;

  get dayInfo() {
    const { sunrise, sunset } = this.args;
    if (!sunrise && !sunset) return null;
    let ticks = [];
    if (sunrise) {
      ticks.push({
        label: 'sunrise',
        time: DateTime.fromISO(sunrise, { setZone: true }).toJSDate(),
      });
    }
    if (sunset) {
      ticks.push({
        label: 'sunset',
        time: DateTime.fromISO(sunset, { setZone: true }).toJSDate(),
      });
    }
    return ticks;
  }

  get hours() {
    return this.args.forecast.map((f) => ({
      ...f,
      startTime: DateTime.fromISO(f.start, { setZone: true }).toJSDate(),
      endTime: DateTime.fromISO(f.end, { setZone: true }).toJSDate(),
    }));
  }

  get timeDomain() {
    const minIso = this.hours[0].startTime;
    const maxIso = this.hours[this.hours.length - 1].endTime;
    return [minIso, maxIso];
  }
}
