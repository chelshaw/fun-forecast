import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | activity-overview', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ActivityOverview />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <ActivityOverview>
        template block text
      </ActivityOverview>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
