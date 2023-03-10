import Service from '@ember/service';
import { DateTime } from 'luxon';
import ENV from 'fun-forecast-frontend/config/environment';
import locationSuggestions from '../utils/example-location-response';

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

  get headers() {
    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    return {
      method: 'GET',
      headers,
    };
  }

  async fetch(path) {
    const requestOptions = this.headers;
    let response = await fetch(`${this.baseUrl}/${path}`, requestOptions);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }

  singleActivity(verb, location, when) {
    if (!ENV.APP.USE_MOCK) {
      let path = `go/${encodeURIComponent(verb)}/${location.lat},${
        location.long
      }`;
      if (when) {
        path += `?when=${when}`;
      }
      console.log({ path });
      return this.fetch(path);
    }
    return this.generateForecast(verb, zipcode);
  }

  generateForecast(verb = 'hike', location) {
    // Mock what we get back from the API
    const today = DateTime.now().startOf('day');
    const sunrise = today.set({ hour: 6, minute: 45 });
    const sunset = today.set({ hour: 17, minute: 57 });
    const forecast = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = today.set({ hour, minute: 0 });
      const score = hour < 5 ? 2 : getRandomInt(3);
      forecast.push({
        start: time.toISO(),
        end: time.plus({ hours: 1 }).toISO(),
        score,
        conditions: score > 0 ? ['cloudy'] : [],
      });
    }
    return {
      verb,
      location: {
        ...location,
        sunrise: sunrise.toISO(),
        sunset: sunset.toISO(),
      },
      forecast,
    };
  }

  async searchLocation(keywords) {
    if (ENV.APP.USE_MOCK) {
      return locationSuggestions;
    }
    const headers = new Headers();
    const requestOptions = {
      method: 'GET',
      headers,
    };
    let response = await this.fetch(
      `location-search/${encodeURIComponent(keywords)}`,
      requestOptions
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }
}
