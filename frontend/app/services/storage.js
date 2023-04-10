import Service, { service } from '@ember/service';
import ENV from 'fun-forecast-frontend/config/environment';

export const KEYS = {
  locations: 'FFv0_locations',
  betaAccess: 'FFv0_beta_access',
};
const OLD_KEYS = [
  'FF_locations',
  'FF0_locations',
  'FF_beta_access',
  'FFv0_visited-activity',
  'FFv0_visited-activities',
];

export default class StorageService extends Service {
  @service store;

  constructor() {
    super(...arguments);

    this.removeOldKeys();
    this.loadFromLocal();
  }

  /** Beta-related helpers */
  checkAccess() {
    return this._get(KEYS.betaAccess);
  }
  saveAccess(value) {
    return this._set(KEYS.betaAccess, value);
  }

  /** Location-related helpers */
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

  clearLocations() {
    return this._remove(KEYS.locations);
  }

  /** Methods for internal use only */
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
  _remove(key) {
    return window.localStorage.removeItem(key);
  }

  get keys() {
    return Object.keys(window.localStorage);
  }

  removeOldKeys() {
    const relevantKeys = this.keys.filter((str) => OLD_KEYS.indexOf(str) >= 0);
    if (!relevantKeys?.length) return;
    relevantKeys.forEach((key) => this._remove(key));
  }
}
