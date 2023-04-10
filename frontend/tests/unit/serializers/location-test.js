import { module, test } from 'qunit';

import { setupTest } from 'fun-forecast-frontend/tests/helpers';

module('Unit | Serializer | location', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('location');

    assert.ok(serializer);
  });

  test('it normalizes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('location', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
