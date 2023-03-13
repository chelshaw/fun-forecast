import { module, test } from 'qunit';
import { setupRenderingTest } from 'ff-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | location-selector', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<LocationSelector />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <LocationSelector>
        template block text
      </LocationSelector>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
