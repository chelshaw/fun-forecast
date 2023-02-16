import { helper } from '@ember/component/helper';
import { verb_icons } from '../utils/verbs';

export default helper(function verbToIcon([verb] /*, named*/) {
  if (!Object.keys(verb_icons).includes(verb)) return verb;
  return verb_icons[verb];
});
