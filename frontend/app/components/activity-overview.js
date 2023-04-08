import Component from '@glimmer/component';
import { getVerbIcon } from '../utils/verbs';

export default class ActivityOverviewComponent extends Component {
  get icon() {
    return getVerbIcon(this.args.verb);
  }
}
