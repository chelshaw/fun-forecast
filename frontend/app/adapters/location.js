import JSONAPIAdapter from '@ember-data/adapter/json-api';



export default class LocationAdapter extends JSONAPIAdapter {
  host = 'http://localhost:4200';
  namespace = 'api/v0';

  urlForQuery(query) {
    const { keyword } = query;
    let baseUrl = this.buildURL();
    return `${baseUrl}/location-search/${encodeURIComponent(keyword)}`;
  }

  urlForFindRecord(id) {
    let baseUrl = this.buildURL();
    return `${baseUrl}/location/${id}`;
  }
}
