import { module, test } from 'qunit';
import { setupTest } from 'fun-forecast-frontend/tests/helpers';

module('Unit | Service | auth', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:auth');
    assert.ok(service);
  });
});
