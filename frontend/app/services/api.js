import Service from '@ember/service';
import { DateTime } from 'luxon';
import ENV from 'fun-forecast-frontend/config/environment';
import locationSuggestions from 'fun-forecast-frontend/utils/example-location-response';
import allowedVerbs from 'fun-forecast-frontend/utils/verbs';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
// function getRandomCondition() {
//   const conditions = ['cloudy', 'windy', 'rainy', 'cold', 'hot'];
//   const idx = getRandomInt(conditions.length);
//   return [conditions[idx]];
// }

export default class ApiService extends Service {
  baseUrl = `${ENV.APP.apiBase}/api/v0`;

  get headers() {
    var headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
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

  /**
   * 
   * @param {*} verb 
   * @param {LocationObject} location id, lat, lng, name, full_name, search
   * @param {*} when 
   * @returns {
      end: "2023-04-02T12:00:00-06:00",
      isDaytime: true,
      score: 0.5818181818181818,
      start: "2023-04-02T11:00:00-06:00",
      temp: 46,
      unit: "F",
      weatherCode: 0,
      weatherStr: "sunny",
      wind: 10,
    }
   */
  async singleActivity(verb, loc_ref) {
    if (!allowedVerbs().includes(verb)) {
      throw new Error(`No activity schema for "${verb}"`);
    }
    if (!ENV.APP.USE_MOCK) {
      let path = `get-forecast/${encodeURIComponent(verb)}/${loc_ref}`;
      const results = await this.fetch(path);
      return {
        forecast: results.evaluated_hours,
        ...results,
      };
    }
    console.debug(`Generating single activity forecast for ${verb}`);
    return this.generateForecast(verb);
  }

  generateForecast(verb = 'hike', startNow = true) {
    // Mock what we get back from the API
    const now = DateTime.now();
    const today = now.startOf('day');
    // const sunrise = today.set({ hour: 6, minute: 45 });
    // const sunset = today.set({ hour: 17, minute: 57 });
    const forecast = [];
    const start = startNow ? now.hour : 0;
    for (let hour = start; hour < 24; hour++) {
      const time = today.set({ hour, minute: 0 });
      const score = Math.random(); // hour < 5 ? 2 : getRandomInt(3);
      forecast.push({
        start: time.toISO(),
        end: time.plus({ hours: 1 }).toISO(),
        isDaytime: hour > 7 && hour < 18,
        score,
        temp: getRandomInt(103),
        unit: 'F',
        weatherCode: 0,
        weatherStr: 'sunny',
        wind: 10,
      });
    }
    return {
      verb,
      forecast,
    };
  }

  searchLocation(keyword) {
    if (ENV.APP.USE_MOCK) {
      console.log('using mock suggestions');
      return locationSuggestions;
    }
    const headers = new Headers();
    const requestOptions = {
      method: 'GET',
      headers,
    };
    return this.fetch(
      `location-search/${encodeURIComponent(keyword)}`,
      requestOptions
    );
  }
}
