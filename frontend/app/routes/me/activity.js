import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeActivityRoute extends Route {
  @service auth;
  @service api;

  groupBy(arr, key) {
    return arr.reduce(function (prev, val) {
      (prev[val[key]] = prev[val[key]] || []).push(val);
      return prev;
    }, {});
  }

  async model(params) {
    const { activity_id } = params;
    const data = await this.api.getActivityByRef(activity_id);
    const { hours } = data;
    return {
      ...data,
      byDayKey: this.groupBy(hours, 'dayKey'),
    };
  }
}
