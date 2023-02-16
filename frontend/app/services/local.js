import Service from '@ember/service';

const prefix = 'FFF_v0';

export default class LocalService extends Service {
  getItem(key) {
    const item = localStorage.getItem(`${prefix}_${key}`);
    return JSON.parse(item);
  }
  setItem(key, val) {
    return localStorage.setItem(`${prefix}_${key}`, JSON.stringify(val));
  }
  remove(key) {
    return localStorage.removeItem(`${prefix}_${key}`);
  }
}
