import Service from '@ember/service';
import { TrackedArray } from 'tracked-built-ins';

const LOCALSTORAGE_KEY = 'FF0_locations';

/**
 * This should probably be a database/API one day. Ember-data candidate?
 */
export default class LocationService extends Service {
  locations = new TrackedArray([]);

  constructor() {
    super(...arguments);
    const stored = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (!stored) return;
    this.locations = JSON.parse(stored);
  }

  /**
   * Add location object to locations array. Should have the following shape:
   * @attr {string} name
   * @attr {string} id
   * @attr {float} lat
   * @attr {float} lng
   * @attr {string} search
   */
  add(loc) {
    const found = this.locations.find((l) => l.id === loc.id);
    if (!found) {
      this.locations.push(loc);
    }
    this._save();
  }

  // Returns matching location by ID, or undefined if not found
  getById(id) {
    return this.locations.find((val) => val.id === id);
  }
  
  getByCoords(coordString) {
    return this.locations.find((val) => `${val.lat},${val.lng}` === coordString);
  }

  getAll() {
    return this.locations;
  }

  clear() {
    const count = this.locations.length;
    this.locations.splice(0, count);
    this._save(LOCALSTORAGE_KEY, []);
  }

  removeIdx(idx) {
    this.locations.splice(idx, 1);
  }

  _save() {
    window.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify(this.locations)
    );
  }
}
