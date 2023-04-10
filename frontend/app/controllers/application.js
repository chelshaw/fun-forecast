import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service storage;

  get isDarkMode() {
    return this.storage.currentMode === 'DARK';
  }
}
