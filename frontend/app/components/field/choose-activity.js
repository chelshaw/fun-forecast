import Component from '@glimmer/component';
import { verb_icons } from '../../utils/verbs';

export default class FieldChooseActivityComponent extends Component {
  get activities() {
    return Object.keys(verb_icons).map((verb) => ({
      verb,
      icon: verb_icons[verb],
      active: true,
    }));
  }
}
