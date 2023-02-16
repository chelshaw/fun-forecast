import Route from '@ember/routing/route';

export default class WhereActivityChooseRoute extends Route {
  model() {
    const { loc_ref } = this.paramsFor('where.activity');
    return loc_ref;
  }
}
