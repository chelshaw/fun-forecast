import Component from '@glimmer/component';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * @verb string, lowercase
 * @location Location obj (id, name, lat, lng, full_name)
 * @forecast array of forecast data { start, end, score }
 * @sunrise ISO timestamp
 * @sunset ISO timestamp
 */
export default class ForecastDetailComponent extends Component {
  hourHeight = 30;
  pad = 10;
  dayInfoSpace = 60;
  now = DateTime.now().toJSDate();

  @tracked highlighted;
  @tracked sticky = false;

  get dayInfo() {
    const { sunrise, sunset } = this.args;
    if (!sunrise || !sunset) return null;
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

  conditionIcon(cond) {
    switch (cond) {
      case 'hot':
        return '🥵';
      case 'cold':
        return '🥶';
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'foggy':
        return '🌫';
      case 'rainy':
        return '🌧';
      case 'stormy':
        return '⛈';
      case 'dark':
        return '🌚';
      case 'windy':
        return '💨';
      default:
        return '🤷🏽‍♀️';
    }
  }

  get hours() {
    return this.args.forecast.map((f) => {
      return {
        ...f,
        // conditionIcon: f.conditions
        //   .map((c) => this.conditionIcon(c))
        //   .filter((c) => !!c)
        //   .join(''),
        startTime: DateTime.fromISO(f.start, { setZone: true }).toJSDate(),
        endTime: DateTime.fromISO(f.end, { setZone: true }).toJSDate(),
      };
    });
  }

  get timeDomain() {
    const date = DateTime.fromISO(this.hours[0].start, { setZone: true });
    const minIso = date.startOf('day').toJSDate();
    const maxIso = date.endOf('day').toJSDate();
    return [minIso, maxIso];
  }

  @action highlightHour(hour) {
    if (!hour) {
      if (!this.sticky) {
        this.highlighted = null;
      }
      return;
    }
    const time = DateTime.fromJSDate(hour.startTime);
    let verdict = '❌ not a great time to';
    if (hour.score > 0.7) {
      verdict = '✅ a great time to';
    } else if (hour.score > 0) {
      verdict = '🆗 a decent time to';
    }
    this.highlighted = {
      startTime: hour.startTime,
      timing: `${time.toLocaleString({ hour: 'numeric' })} to ${time
        .plus({ hours: 1 })
        .toLocaleString({ hour: 'numeric' })}`,
      verdict,
      temperature: hour.temp,
      unit: hour.unit,
      wind: hour.wind,
      score: hour.score.toFixed(2),
      condition: hour.weatherStr,
    };
  }
}
