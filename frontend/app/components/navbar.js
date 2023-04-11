import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class NavbarComponent extends Component {
  @service storage;

  @tracked isDarkMode = false;

  constructor() {
    super(...arguments);
    this.isDarkMode = this.storage.currentMode === 'DARK';
  }

  @action toggleMode(fromMode) {
    const mode = !fromMode ? 'DARK' : 'LIGHT';
    this.storage.setTheme(mode);
  }
}
