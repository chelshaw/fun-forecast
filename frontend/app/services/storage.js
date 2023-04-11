import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export const KEYS = {
  locations: 'FFv0_locations',
  betaAccess: 'FFv0_beta_access',
  theme: 'FFv0_theme',
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

  @tracked currentMode = 'LIGHT';

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

  /** Dark mode related helpers */
  loadDarkMode() {
    try {
      const themeMode = this._get(KEYS.theme);
      if (
        themeMode === 'DARK' ||
        (!themeMode &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.setTheme('DARK');
      } else {
        this.setTheme('LIGHT');
      }
    } catch (e) {
      console.debug('Problem loading dark mode:', e);
    }
  }

  @action
  setTheme(mode) {
    if (mode.toUpperCase() === 'DARK') {
      this.currentMode = 'DARK';
      this._set(KEYS.theme, 'DARK');
    } else {
      this.currentMode = 'LIGHT';
      this._set(KEYS.theme, 'LIGHT');
    }
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
