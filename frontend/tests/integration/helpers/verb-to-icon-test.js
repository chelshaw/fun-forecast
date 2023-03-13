import { module, test } from 'qunit';
import { setupRenderingTest } from 'ff-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | verb-to-icon', function (hooks) {
  setupRenderingTest(hooks);

  // TODO: Replace this with your real tests.
  test('it renders', async function (assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{verb-to-icon this.inputValue}}`);

    assert.dom(this.element).hasText('1234');
  });
});
