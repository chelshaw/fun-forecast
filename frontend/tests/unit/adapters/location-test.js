import { module, test } from 'qunit';

import { setupTest } from 'fun-forecast-frontend/tests/helpers';

module('Unit | Adapter | location', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:location');
    assert.ok(adapter);
  });
  test('it calls the right endpoint for query', function (assert) {
    let adapter = this.owner.lookup('adapter:location');
    const result = adapter.urlForQuery({ keyword: 'foo' });
    assert.strictEqual(
      result,
      'http://localhost:4200/api/v0/location-search/foo'
    );
  });
  test('it calls the right endpoint for findRecord', function (assert) {
    let adapter = this.owner.lookup('adapter:location');
    const result = adapter.urlForFindRecord('23.483,-77.222');
    assert.strictEqual(
      result,
      'http://localhost:4200/api/v0/location-by-coords/23.483,-77.222'
    );
  });
});
