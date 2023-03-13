import { module, test } from 'qunit';
import { setupTest } from 'ff-frontend/tests/helpers';

module('Unit | Route | where/activity/detail', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:where/activity/detail');
    assert.ok(route);
  });
});
