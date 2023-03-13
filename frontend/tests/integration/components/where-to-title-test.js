import { module, test } from 'qunit';
import { setupRenderingTest } from 'ff-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | where-to-title', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('loc', {
      name: 'San Antonio',
      id: 'loc-id-1',
      lat: 32.4931,
      lng: -72.4383,
      searchText: 'san anton',
    });
  });

  test('it renders with nothing passed in', async function (assert) {
    await render(hbs`<WhereToTitle />`);

    assert
      .dom('[data-test-where-to-title]')
      .hasText('When to __________ in __________');
    assert.dom('[data-test-activity-link]').hasAttribute('disabled');
    assert.dom('[data-test-where-link]').hasAttribute('disabled');
  });

  test('it renders with only where passed in', async function (assert) {
    await render(hbs`<WhereToTitle @location={{this.loc}} />`);

    assert
      .dom('[data-test-where-to-title]')
      .hasText('When to __________ in San Antonio');
    assert.dom('[data-test-activity-link]').doesNotHaveAttribute('disabled');
    assert
      .dom('[data-test-activity-link]')
      .hasProperty('href', 'http://localhost:4200/where/loc-id-1/to/choose');
    assert.dom('[data-test-where-link]').doesNotHaveAttribute('disabled');
    assert
      .dom('[data-test-where-link]')
      .hasProperty('href', 'http://localhost:4200/where/choose');
  });

  test('it renders with all params passed in', async function (assert) {
    await render(
      hbs`<WhereToTitle @verb="paddleboard" @location={{this.loc}} />`
    );

    assert
      .dom('[data-test-where-to-title]')
      .hasText('When to paddleboard in San Antonio');
    assert.dom('[data-test-activity-link]').doesNotHaveAttribute('disabled');
    assert
      .dom('[data-test-activity-link]')
      .hasProperty('href', 'http://localhost:4200/where/loc-id-1/to/choose');
    assert.dom('[data-test-where-link]').doesNotHaveAttribute('disabled');
    assert
      .dom('[data-test-where-link]')
      .hasProperty('href', 'http://localhost:4200/where/choose');
  });
});
