import Component from '@glimmer/component';
import { allActivities } from 'fun-forecast-frontend/utils/verbs';

export default class FieldChooseActivityComponent extends Component {
  get activities() {
    return allActivities;
  }
}
