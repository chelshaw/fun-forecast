import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupRenderingTest } from 'fun-forecast-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { allActivities } from 'fun-forecast-frontend/utils/verbs';

module('Integration | Component | field/choose-activity', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(27);
    const selectSpy = sinon.spy();
    this.set('onSelect', selectSpy);

    await render(hbs`<Field::ChooseActivity @onSelect={{this.onSelect}} />`);
    assert.dom('[data-test-activity-option]').exists({ count: 13 });
    allActivities.forEach((activity) => {
      assert
        .dom(`[data-test-activity-option="${activity.verb}"]`)
        .hasTagName('button');
      assert
        .dom(`[data-test-activity-option="${activity.verb}"]`)
        .containsText(activity.verb);
    });
    // assert.dom(this.element).hasText('');
  });
});
