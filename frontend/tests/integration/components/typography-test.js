import { module, test } from 'qunit';
import { setupRenderingTest } from 'ff-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | typography', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with default classes', async function (assert) {
    await render(hbs`<Typography>hello</Typography>`);

    assert.dom('[data-test-typography]').hasText('hello');
    assert.dom('[data-test-typography]').hasTagName('p');
    assert
      .dom('[data-test-typography]')
      .doesNotHaveClass('font-display', 'p tag does not include font-display');
  });

  test('it renders the level as tag', async function (assert) {
    this.set('level', 'h1');
    await render(hbs`
      <Typography @level={{this.level}}>
        Title
      </Typography>
    `);

    assert.dom('[data-test-typography]').hasText('Title');
    assert.dom('[data-test-typography]').hasTagName('h1');
    assert.dom('[data-test-typography]').hasClass('font-display');
    assert.dom('[data-test-typography]').hasClass('font-bold');
    assert.dom('[data-test-typography]').hasClass('text-2xl');

    this.set('level', 'h2');
    assert.dom('[data-test-typography]').hasText('Title');
    assert.dom('[data-test-typography]').hasTagName('h2');
    assert.dom('[data-test-typography]').hasClass('font-display');
    assert.dom('[data-test-typography]').hasClass('font-bold');
    assert.dom('[data-test-typography]').hasClass('text-xl');

    this.set('level', 'h3');
    assert.dom('[data-test-typography]').hasText('Title');
    assert.dom('[data-test-typography]').hasTagName('h3');
    assert.dom('[data-test-typography]').hasClass('font-display');
    assert.dom('[data-test-typography]').hasClass('font-bold');
    assert.dom('[data-test-typography]').hasClass('text-lg');

    this.set('level', 'foo');
    assert.dom('[data-test-typography]').hasText('Title');
    assert.dom('[data-test-typography]').hasTagName('p');
    assert.dom('[data-test-typography]').doesNotHaveClass('font-display');
    assert.dom('[data-test-typography]').doesNotHaveClass('font-bold');
  });
});
