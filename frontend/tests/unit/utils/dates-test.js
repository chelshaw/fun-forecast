import { DateTime } from 'luxon';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { daysFromToday, DATE_FORMAT } from 'ff-frontend/utils/dates';

module('Unit | Utility | date', function () {
  module('daysFromToday', function (hooks) {
    hooks.before(function () {
      const expectedNow = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 2,
        hour: 14,
      });
      sinon.stub(DateTime, 'now').returns(expectedNow);
    });

    test('it works with default', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 2,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday();
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });

    test('it returns tomorrow if afterHour < nowHour and days is 0', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 3,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday(0, 10);
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });

    test('it returns tomorrow if afterHour = nowHour and days is 0', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 3,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday(0, 14);
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });

    test('it returns today if afterHour > nowHour and days is 0', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 2,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday(0, 16);
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });

    test('it returns normally if days > 0 and afterHour set', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 4,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday(2, 10);
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });

    test('it works with positive numbers', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 7,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday(5);
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });

    test('it works with negative numbers', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 1,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday(-1);
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });

    test('it works with string numbers', function (assert) {
      const expectedResponse = DateTime.fromObject({
        year: 2022,
        month: 2,
        day: 4,
      }).toFormat(DATE_FORMAT);
      const result = daysFromToday('2');
      assert.equal(
        result.toFormat(DATE_FORMAT),
        expectedResponse,
        `returns ${expectedResponse}`
      );
    });
  });
});
