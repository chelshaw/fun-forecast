import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { verb_icons } from '../utils/verbs';

export default class ActivityOverviewComponent extends Component {
  get icon() {
    assert(
      'Verb does not exist',
      Object.keys(verb_icons).includes(this.args.verb)
    );
    return verb_icons[this.args.verb];
  }
}
