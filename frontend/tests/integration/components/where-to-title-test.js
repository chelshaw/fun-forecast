import { module, test } from 'qunit';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | where-to-title', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<WhereToTitle />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <WhereToTitle>
        template block text
      </WhereToTitle>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
