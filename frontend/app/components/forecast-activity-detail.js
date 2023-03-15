import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { DateTime, Duration } from 'luxon';

export default class ForecastActivityDetailComponent extends Component {
  hourHeight = 50;
  hourWidth = 100;
  @tracked selected = null;

  constructor() {
    super(...arguments);
    const today = DateTime.now();
    this.todayOfYear = today.year + today.ordinal;
  }

  get daily() {
    const hour = new Duration({ hours: 1 });
    const { startOfDay, sunrise, sunset, endOfDay } = this.dayInfo;
    return [
      startOfDay,
      sunrise.minus(hour),
      sunrise,
      sunset,
      sunset.plus(hour),
      endOfDay,
    ].map((t) => t.toJSDate());
  }

  get sky() {
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

  get dayDomain() {
    const days = this.hours.map((h) => h.dayOfWeek);
    return new Set(days);
  }

  get hourDomain() {
    return new Set(this.hours.map((h) => h.time));
  }

  get dayOptions() {
    return new Set(
      this.hours.map((h) => ({
        value: h.date,
        label: h.dayOfWeek,
      }))
    );
  }

  @action onSeek(evt) {
    this.selected = evt ? evt.datum.datum : null;
  }
  get ticks() {
    return this.hours.map((h) => ({ label: h.time, value: h.hour }));
  }
  tickFormat(tick) {
    return tick.time;
  }

  get hours() {
    return this.args.hours
      .map((h) => {
        const { good, dayOfWeek, hour, time, dayKey, dayOfYear } = h;
        return {
          id: `${dayKey} ${time}`,
          good,
          dayOfWeek,
          hour,
          time,
          date: dayKey,
          dayOfYear,
        };
      })
      .filter(
        (h) =>
          h.dayOfYear >= this.todayOfYear && h.dayOfYear <= this.todayOfYear + 1
      );
  }
}
