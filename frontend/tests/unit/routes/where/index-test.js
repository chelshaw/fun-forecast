import { module, test } from 'qunit';
import { setupTest } from 'fun-forecast-frontend/tests/helpers';

module('Unit | Route | where/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:where/index');
    assert.ok(route);
  });
});
