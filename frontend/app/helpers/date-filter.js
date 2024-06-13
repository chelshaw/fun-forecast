import { helper } from '@ember/component/helper';

export default helper(function dateFilter([hours], { date }) {
  return hours.filter((hour) => hour.start.includes(date));
});
