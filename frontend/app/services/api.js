import Service from '@ember/service';
import { DateTime } from 'luxon';
import ENV from 'fun-forecast-frontend/config/environment';
import { SINGLE_DAY_FORECAST_MOTO } from '../utils/mock-responses';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export default class ApiService extends Service {
  baseUrl = 'http://localhost:1323/api/v0';

  generateForecast(verb = 'hike', zipcode = '90210') {
    // Mock what we get back from the API (or want to have)
    const today = DateTime.now().startOf('day');
    console.log(today.locale, 'zone');
    const sunrise = today.set({ hour: 6, minute: 45 });
    const sunset = today.set({ hour: 17, minute: 57 });
    const forecast = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = today.set({ hour, minute: 0 });
      forecast.push({
        start: time.toISO(),
        end: time.plus({ hours: 1 }).toISO(),
        score: getRandomInt(3),
      });
    }
    /*
  verb: 'motorcycle',
  location_key: '90210',
  location_name: 'Beverly Hills, CA', // TODO: Update this format
  forecast: [
    {
      start: '2023-02-14T00:00:00-05:00',
      end: '2023-02-14T01:00:00-05:00',
      day: 2068,
      good: false,
      reason: 'too cold',
      overview: 'clear and 41°F',
    },
  */
    return {
      verb,
      location: {
        ref: zipcode,
        city: 'Beverly Hills',
        state: 'CA',
        sunrise: sunrise.toISO(),
        sunset: sunset.toISO(),
      },
      forecast,
    };
  }
  async getApi(path) {
    let response = await fetch(`${this.baseUrl}/${path}`);
    return response.json();
  }

  async getActivityByRef(aRef) {
    const json = ENV.APP.USE_MOCK
      ? SINGLE_DAY_FORECAST_MOTO
      : await this.getApi(`me/${aRef}`);
    const [verb, zipcode] = aRef.split('_');
    return {
      verb,
      locationKey: zipcode,
      locationName: json.location_name,
      location: {
        key: zipcode,
        name: json.location_name,
      },
      hours: this.formatHours(json.forecast),
    };
  }

  groupBy(arr, key) {
    return arr.reduce(function (prev, val) {
      (prev[val[key]] = prev[val[key]] || []).push(val);
      return prev;
    }, {});
  }

  formatHours(hours) {
    return hours.map((d) => {
      const startTime = DateTime.fromISO(d.start, { setZone: true });
      const endTime = DateTime.fromISO(d.end, { setZone: true });
      const dayKey = startTime.toLocaleString({
        month: 'short',
        day: 'numeric',
      });
      if (!dayKey) {
        console.log('NO DAYKEY', d);
      }
      return {
        description: `between ${startTime.toLocaleString({
          hour: 'numeric',
        })} and ${endTime.toLocaleString({ hour: 'numeric' })}`,
        ...d,
        dayOfYear: startTime.year + startTime.ordinal,
        dayKey,
        dayOfWeek: startTime.toLocaleString({
          weekday: 'short',
        }),
        jsDate: startTime.toJSDate(),
        // dateTime: startTime,
        startTime: startTime.toMillis(),
        hour: startTime.hour,
        time: startTime.toLocaleString({
          hour: 'numeric',
        }),
      };
    });
  }
}
