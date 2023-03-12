import Service from '@ember/service';
import { DateTime } from 'luxon';
import ENV from 'fun-forecast-frontend/config/environment';
import locationSuggestions from '../utils/example-location-response';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export default class ApiService extends Service {
  baseUrl = 'http://localhost:4200/api/v0';

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
    if (!ENV.APP.USE_MOCK && ENV.APP.API_READY) {
      let path = `go/${encodeURIComponent(verb)}/${location.lat},${
        location.lng
      }`;
      if (when) {
        path += `?when=${when}`;
      }
      return this.fetch(path);
    }
    return this.generateForecast(verb, location);
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

  searchLocation(keywords) {
    if (ENV.APP.USE_MOCK) {
      return locationSuggestions;
    }
    const headers = new Headers();
    const requestOptions = {
      method: 'GET',
      headers,
    };
    return this.fetch(
      `location-search/${encodeURIComponent(keywords)}`,
      requestOptions
    );
  }
}
