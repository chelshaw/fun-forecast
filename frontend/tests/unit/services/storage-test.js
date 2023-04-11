import { module, test } from 'qunit';
import { setupTest } from 'fun-forecast-frontend/tests/helpers';

module('Unit | Service | storage', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.clear();
  });
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:storage');
    assert.ok(service);
  });
});
