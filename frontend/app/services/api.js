import Service from '@ember/service';
import { DateTime } from 'luxon';
import ENV from 'fun-forecast-frontend/config/environment';
import { SINGLE_DAY_FORECAST_MOTO } from '../utils/mock-responses';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function exampleLocations(zipcode) {
  switch (zipcode) {
    case 78133:
      return { city: 'Canyon Lake', state: 'TX' };
    case 78666:
      return { city: 'San Marcos', state: 'TX' };
    case 78701:
    case 78702:
    case 78703:
    case 78704:
    case 78751:
      return { city: 'Austin', state: 'TX' };
    default:
      return { city: 'Beverly Hills', state: 'CA' };
  }
}
export default class ApiService extends Service {
  baseUrl = 'http://localhost:1323/api/v0';

  async fetch(path) {
    let response = await fetch(`${this.baseUrl}/${encodeURIComponent(path)}`);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }

  singleActivity(verb, zipcode) {
    if (!ENV.APP.USE_MOCK) {
      console.info('API not yet implemented. Using generated data');
    }
    return this.generateForecast(verb, zipcode);
  }

  generateForecast(verb = 'hike', zipcode = '90210') {
    // Mock what we get back from the API
    const today = DateTime.now().startOf('day');
    const sunrise = today.set({ hour: 6, minute: 45 });
    const sunset = today.set({ hour: 17, minute: 57 });
    const forecast = [];
    const loc = exampleLocations(zipcode);
    for (let hour = 0; hour < 24; hour++) {
      const time = today.set({ hour, minute: 0 });
      forecast.push({
        start: time.toISO(),
        end: time.plus({ hours: 1 }).toISO(),
        score: getRandomInt(3),
      });
    }
    return {
      verb,
      location: {
        ref: zipcode,
        ...loc,
        sunrise: sunrise.toISO(),
        sunset: sunset.toISO(),
      },
      forecast,
    };
  }

  /* DEPRECATED */
  async getActivityByRef(aRef) {
    const json = ENV.APP.USE_MOCK
      ? SINGLE_DAY_FORECAST_MOTO
      : await this.fetch(`me/${aRef}`);
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

  /* DEPRECATED */
  groupBy(arr, key) {
    return arr.reduce(function (prev, val) {
      (prev[val[key]] = prev[val[key]] || []).push(val);
      return prev;
    }, {});
  }

  /* DEPRECATED */
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
        startTime: startTime.toMillis(),
        hour: startTime.hour,
        time: startTime.toLocaleString({
          hour: 'numeric',
        }),
      };
    });
  }
}
