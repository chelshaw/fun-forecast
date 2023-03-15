import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LocationSelectorComponent extends Component {
  @service router;
  @service api;

  @tracked error = '';
  @tracked searchText = '';
  @tracked suggestions = [];

  constructor() {
    super(...arguments);

    const { initialSearch } = this.args;
    if (initialSearch) {
      this.searchText = initialSearch;
      this.fetchLocationSuggestions(initialSearch);
    }
  }

  async fetchLocationSuggestions(searchText) {
    this.suggestions = [];
    if (!searchText) return;
    try {
      const { features } = await this.api.searchLocation(searchText);
      this.suggestions = features;
    } catch (e) {
      this.error =
        e.message ||
        'There was an error fetching location suggestions based on your search. Try a different search term, or try again later.';
    }
  }

  @action resetForm() {
    this.searchText = '';
    this.suggestions = [];
  }

  // TODO: concurrency for loading state
  @action
  searchForLocations(evt) {
    evt.preventDefault();
    const searchText = this.searchText;
    this.fetchLocationSuggestions(searchText);
  }

  @action selectLocation(loc) {
    const locData = {
      id: loc.id,
      lat: loc.center[1],
      lng: loc.center[0],
      name: loc.text,
      search: this.searchText,
    };
    this.args.onSelect(locData);
  }
}
