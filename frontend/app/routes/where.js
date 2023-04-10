import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'fun-forecast-frontend/config/environment';

const correctAnswer = ENV.APP.betacode;

export default class WhereRoute extends Route {
  @service router;
  @service storage;

  compareStrings(stringA = '', stringB = '') {
    return stringA?.toLowerCase() === stringB?.toLowerCase();
  }

  async beforeModel() {
    const accessKey = this.storage.checkAccess();
    if (this.compareStrings(correctAnswer, accessKey)) return;

    const answer = await window.prompt('Enter the passcode for beta access');
    if (this.compareStrings(correctAnswer, answer)) {
      this.storage.saveAccess(answer);
    } else {
      this.router.transitionTo('access-denied');
    }
  }
}
