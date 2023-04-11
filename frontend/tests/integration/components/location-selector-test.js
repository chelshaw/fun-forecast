import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render, typeIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | location-selector', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<LocationSelector />`);

    assert
      .dom('[data-test-location-selector-label]')
      .hasText('Search for a location by name, zipcode, etc');
    assert.dom('[data-test-location-selector-submit]').hasText('Search');
    await typeIn('[data-test-location-selector-input]', 'Example search');
  });
});
