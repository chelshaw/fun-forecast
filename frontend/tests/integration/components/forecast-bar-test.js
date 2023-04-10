import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import exampleForecastResponse from 'fun-forecast-frontend/utils/example-forecast-response';

module('Integration | Component | forecast-bar', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.hours = exampleForecastResponse.evaluated_hours;
  });

  test('it renders all hours when this.allHours = true', async function (assert) {
    await render(
      hbs`<ForecastBar @verb={{this.verb}} @hours={{this.hours}} @allHours={{true}} />`
    );
    assert.dom('#hours rect').exists({ count: 24 });
  });

  test('it renders a subset of hours when this.allHours = false', async function (assert) {
    await render(
      hbs`<ForecastBar @verb={{this.verb}} @hours={{this.hours}} />`
    );
    assert.dom('#hours rect').exists({ count: 14 });
  });
});
