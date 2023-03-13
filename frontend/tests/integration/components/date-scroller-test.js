import { module, skip } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | date-scroller', function (hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<DateScroller />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <DateScroller>
        template block text
      </DateScroller>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
