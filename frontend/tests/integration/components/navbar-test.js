import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | navbar', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders heading by default', async function (assert) {
    await render(hbs`<Navbar />`);

    assert.dom(this.element).hasText('🌞 🌚 Fun Forecast');

    await render(hbs`
      <Navbar>
        template block text
      </Navbar>
    `);

    assert.dom(this.element).includesText('template block text');
  });
});
