import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | str', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{str this.inputValue}}`);

    assert.dom(this.element).hasText('1234');
  });

  test('it renders number as string', async function (assert) {
    this.set('inputValue', 1234);

    await render(hbs`{{str this.inputValue}}`);

    assert.dom(this.element).hasText('1234');
  });
});
