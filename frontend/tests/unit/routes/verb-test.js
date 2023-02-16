import { module, test } from 'qunit';
import { setupTest } from 'fun-forecast-frontend/tests/helpers';

module('Unit | Route | verb', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:verb');
    assert.ok(route);
  });
});
