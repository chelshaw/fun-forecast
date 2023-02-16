import { helper } from '@ember/component/helper';

export default helper(function str([input] /*, named*/) {
  return input != null ? input.toString() : undefined;
});
