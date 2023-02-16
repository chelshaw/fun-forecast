import { helper } from '@ember/component/helper';
import { DateTime } from 'luxon';

export default helper(function formatDate([jsDate], named) {
  return DateTime.fromJSDate(jsDate).toLocaleString({
    ...named,
  });
});
