import { module, skip } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import exampleForecastResponse from 'fun-forecast-frontend/utils/example-forecast-response';

module('Integration | Component | forecast-activity-detail', function (hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function (assert) {
    this.set('hours', exampleForecastResponse.evaluated_hours);
    await render(hbs`<ForecastActivityDetail @hours={{this.hours}} />`);
    assert.dom(this.element).hasText('');
  });
});
