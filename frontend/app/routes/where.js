import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'fun-forecast-frontend/config/environment';

const storageKey = `FF_beta_access`;
const correctAnswer = ENV.APP.betacode;

export default class WhereRoute extends Route {
  @service router;

  compareStrings(stringA = '', stringB = '') {
    return stringA?.toLowerCase() === stringB?.toLowerCase();
  }

  async beforeModel() {
    const hasAccess = localStorage.getItem(storageKey);
    if (this.compareStrings(correctAnswer, hasAccess)) return;
    const answer = await window.prompt('Enter the passcode for beta access');
    if (this.compareStrings(correctAnswer, answer)) {
      localStorage.setItem(storageKey, answer);
    } else {
      this.router.transitionTo('access-denied');
    }
  }
}
