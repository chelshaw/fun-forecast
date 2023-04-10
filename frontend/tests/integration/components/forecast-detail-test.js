import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import exampleForecastResponse from 'fun-forecast-frontend/utils/example-forecast-response';

module('Integration | Component | forecast-detail', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.verb = 'golf';
    this.forecast = exampleForecastResponse.evaluated_hours;
    this.location = {
      id: '23.483,-77.222',
      lat: 23.483,
      lng: -77.222,
      name: 'Daisy Fields',
      fullName: 'Daisy Fields Playground, FantasyLand, Place',
    };
  });

  test('it renders', async function (assert) {
    await render(
      hbs`<ForecastDetail @verb={{this.verb}} @forecast={{this.forecast}} @location={{this.location}} />`
    );
    await this.pauseTest();
    assert.dom('#hours rect').exists({ count: 24 }, 'Shows all 24 hours');
  });
});
