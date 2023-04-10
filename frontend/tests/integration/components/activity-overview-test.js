import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import exampleForecastResponse from 'fun-forecast-frontend/utils/example-forecast-response';

module('Integration | Component | activity-overview', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a sane default', async function (assert) {
    await render(hbs`<ActivityOverview />`);
    assert.dom('[data-test-activity-overview-icon]').hasText('🟣');
    assert
      .dom('[data-test-forecast-bar]')
      .doesNotExist('Forecast bar not rendered');
    assert
      .dom('[data-test-activity-overview-empty')
      .hasText('No hours available');
  });

  test('it renders with icon', async function (assert) {
    await render(hbs`<ActivityOverview @verb="hike" />`);
    assert.dom('[data-test-activity-overview-icon]').hasText('🥾');
  });

  test('it renders with icon', async function (assert) {
    this.set('hours', exampleForecastResponse.evaluated_hours);

    await render(hbs`<ActivityOverview @verb="hike" @hours={{this.hours}} />`);
    assert.dom('[data-test-activity-overview-icon]').hasText('🥾');
    assert.dom('[data-test-forecast-bar]').exists('Forecast bar is rendered');
    assert
      .dom('[data-test-activity-overview-empty')
      .doesNotExist('Empty state not rendered');
  });
});
