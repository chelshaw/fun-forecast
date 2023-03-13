import { module, test } from 'qunit';
import { setupRenderingTest } from 'ff-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | forecast-detail', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ForecastDetail />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <ForecastDetail>
        template block text
      </ForecastDetail>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
