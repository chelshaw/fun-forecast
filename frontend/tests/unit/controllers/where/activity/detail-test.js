import { module, test } from 'qunit';
import { setupTest } from 'ff-frontend/tests/helpers';

module('Unit | Controller | where/activity/detail', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:where/activity/detail');
    assert.ok(controller);
  });
});
