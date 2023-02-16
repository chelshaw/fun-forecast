import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const STORAGE_KEY = 'FFv1';

const mockUser = {
  name: 'Kaylee',
  locationKey: 78666,
  locationName: 'San Marcos',
  activities: [],
};

export default class AuthService extends Service {
  @service router;
  @tracked currentUser = null;

  constructor() {
    super(...arguments);
    const stringified = localStorage?.getItem(`${STORAGE_KEY}_user`);
    if (!stringified) return;
    this.currentUser = JSON.parse(stringified);
  }

  signIn() {
    this.currentUser = mockUser;
    localStorage?.setItem(`${STORAGE_KEY}_user`, JSON.stringify(mockUser));
  }

  signOut() {
    this.currentUser = null;
    localStorage?.removeItem(`${STORAGE_KEY}_user`);
  }

  saveActivityToUser(newActivity) {
    if (!this.currentUser) throw new Error('Please log in first');
    const user = { ...this.currentUser };
    user.activities = [...user.activities, newActivity];
    localStorage?.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
    return;
  }
}
