import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { DateTime } from 'luxon';

/**
 * module ForecastBar renders a horizontal bar for a single day of hours
 * @param {array} hours - Array of hours for a single day
 * @param {string} verb - Verb (lowercase) for display purposes
 * @param {boolean} interactive - When true, displays details on click
 * @param {boolean} showSky - When true, displays sky gradient
 */
export default class ForecastBarComponent extends Component {
  frameHeight = 50;
  pointOffset = 10;
  chartHeight = 20;
  @tracked highlighted = null;

  @action
  highlightHour(datum) {
    if (this.args.interactive) {
      this.highlighted = datum;
    }
  }

  get sky() {
    // FUTURE: parse from args ISO "2023-02-14T02:00:00-05:00"
    const transition = { hours: 1 };
    const { startTime } = this.args.hours[0];
    const dateTime = DateTime.fromMillis(startTime);

    const sunrise = dateTime.set({ hour: 6, minute: 45 });
    const sunset = dateTime.set({ hour: 17, minute: 57 });
    const [nightSky, daySky, sunriseSky] = ['#0c4a6e', '#0ea5e9', '#fdba74'];
    return [
      { time: sunrise.minus(transition), color: nightSky },
      { time: sunrise, color: sunriseSky },
      { time: sunrise.plus(transition), color: daySky },
      { time: sunset.minus(transition), color: daySky },
      { time: sunset, color: sunriseSky },
      { time: sunset.plus(transition), color: nightSky },
    ].map(({ time, color }) => {
      const pct = Math.round(((time.hour + time.minute / 60) / 24) * 100);
      return { offset: `${pct}%`, color };
    });
  }

  get timeDomain() {
    const minIso = this.args.hours[0].start;
    const maxIso = this.args.hours[this.args.hours.length - 1].end;
    return [minIso, maxIso].map((iso) =>
      DateTime.fromISO(iso, { setZone: true }).toJSDate()
    );
  }

  formatTick(t) {
    return DateTime.fromJSDate(t).toLocaleString({
      hour: '2-digit',
    });
  }

  get ticks() {
    return this.args.hours
      .filter((hour) => {
        return [7, 13, 19].includes(hour.hour);
      })
      .map((hour) => hour.jsDate);
  }
}
