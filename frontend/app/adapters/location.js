import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'fun-forecast-frontend/config/environment';

export default class LocationAdapter extends JSONAPIAdapter {
  host = ENV.APP.apiBase;
  namespace = 'api/v0';

  urlForQuery(query) {
    const { keyword } = query;
    let baseUrl = this.buildURL();
    return `${baseUrl}/location-search/${encodeURIComponent(keyword)}`;
  }

  urlForFindRecord(id) {
    let baseUrl = this.buildURL();
    return `${baseUrl}/location-by-coords/${id}`;
  }
}
