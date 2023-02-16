import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class WhereToTitleComponent extends Component {
  @tracked showLocationSelect;
  @action toggleLocationSelect() {
    this.showLocationSelect = !this.showLocationSelect;
  }
}
