import { DateTime } from 'luxon';

/**
 *
 * @param {int} days
 * @returns DateTime
 */
export function daysFromToday(days = 0, afterHour) {
  const now = DateTime.now();
  if (!days && afterHour && now.hour >= afterHour) {
    return now.plus({ days: 1 });
  } else if (!days) {
    return now;
  }
  const whenInt = parseInt(days, 10);
  if (isNaN(whenInt)) {
    return now;
  }

  return now.plus({ days: whenInt });
}

export const DATE_FORMAT = 'yyyy-MM-dd';
