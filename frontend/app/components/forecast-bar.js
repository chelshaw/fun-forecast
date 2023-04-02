import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { DateTime } from 'luxon';

/**
 * module ForecastBar renders a horizontal bar for a single day of hours
 * @param {array} hours - Array of hours for a single day
 * @param {string} verb - Verb (lowercase) for display purposes
 * @param {string} loc - Location
 * @param {boolean} interactive - When true, displays details on click
 * @param {boolean} showSky - When true, displays sky gradient
 * @param {boolean} allHours - when true, display will not leave out the first and last 5 hours of the day.
 */
export default class ForecastBarComponent extends Component {
  frameHeight = 50;
  pointOffset = 0;
  chartHeight = 20;
  chartWidthPct = 30;
  @tracked highlighted = null;

  get hours() {
    return this.args.hours
      .map((h) => ({
        ...h,
        jsDate: DateTime.fromISO(h.start),
      }))
      .filter((h) => {
        if (this.allHours) return true;
        return h.jsDate.hour > 5 && h.jsDate.hour < 20;
      })
      .map((h) => ({
        ...h,
        jsDate: h.jsDate.toJSDate(),
      }));
  }

  // get sky() {
  //   // FUTURE: parse from args ISO "2023-02-14T02:00:00-05:00"
  //   const transition = { hours: 1 };
  //   const { start } = this.args.hours[0];
  //   const dateTime = DateTime.fromISO(start);

  //   const sunrise = dateTime.set({ hour: 6, minute: 45 });
  //   const sunset = dateTime.set({ hour: 17, minute: 57 });
  //   const [nightSky, daySky, sunriseSky] = ['#004368', '#87E2FF', '#DE9E15'];
  //   console.log({ sunrise, sunset });
  //   return [
  //     { time: sunrise.minus(transition), color: nightSky },
  //     { time: sunrise, color: sunriseSky },
  //     { time: sunrise.plus(transition), color: daySky },
  //     { time: sunset.minus(transition), color: daySky },
  //     { time: sunset, color: sunriseSky },
  //     { time: sunset.plus(transition), color: nightSky },
  //   ].map(({ time, color }) => {
  //     const pct = Math.round(((time.hour + time.minute / 60) / 24) * 100);
  //     return { offset: `${pct}%`, color };
  //   });
  // }

  get widthDomain() {
    const hourCount = this.hours.length;
    return [0, hourCount];
  }

  get timeDomain() {
    const minIso = this.hours[0].start;
    const maxIso = this.hours[this.hours.length - 1].end;
    return [minIso, maxIso].map((iso) =>
      DateTime.fromISO(iso, { setZone: true }).toJSDate()
    );
  }

  formatTick(t) {
    return DateTime.fromJSDate(t).toLocaleString({
      hour: 'numeric',
    });
  }

  get ticks() {
    return this.hours
      .filter((_, idx) => (idx + 1) % 2 === 0)
      .map((h) => h.jsDate);
  }
}
