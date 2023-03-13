import { module, test } from 'qunit';
import { setupRenderingTest } from 'ff-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | forecast-bar', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ForecastBar />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <ForecastBar>
        template block text
      </ForecastBar>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
