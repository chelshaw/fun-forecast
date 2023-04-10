import Service, { service } from '@ember/service';

export const KEYS = {
  locations: 'FFv0_locations',
};

export default class StorageService extends Service {
  @service store;

  constructor() {
    super(...arguments);

    this.loadFromLocal();
  }

  addLocation(locData) {
    const locations = this._get(KEYS.locations) || [];
    locations.push(locData);
    this._set(KEYS.locations, locations);
  }

  loadFromLocal() {
    try {
      const localLocations = this._get(KEYS.locations);
      if (!localLocations) return;

      this.store.pushPayload('location', {
        data: localLocations,
      });
    } catch (e) {
      console.debug('Could not load locations from localstorage:', e);
    }
  }

  /* Methods for internal use only */
  _get(key) {
    const item = window.localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (e) {
      // If it's unparseable, return the raw string
      return item;
    }
  }

  _set(key, value) {
    const item = JSON.stringify(value);
    return window.localStorage.setItem(key, item);
  }
}
