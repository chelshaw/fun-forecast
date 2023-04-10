import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { DateTime } from 'luxon';

module('Integration | Helper | format-date', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders given a JSDate', async function (assert) {
    this.set(
      'inputValue',
      DateTime.fromISO('2012-05-24T09:08:34.123').toJSDate()
    );

    await render(hbs`{{format-date this.inputValue}}`);
    assert.dom(this.element).hasText('5/24/2012');

    await render(hbs`{{format-date this.inputValue hour="numeric"}}`);
    assert.dom(this.element).hasText('9 AM', 'Uses positional attributes');
  });
});
