import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ff-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | alert', function (hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function (assert) {
    // Template block usage:
    await render(hbs`
      <Alert>
        template block text
      </Alert>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
