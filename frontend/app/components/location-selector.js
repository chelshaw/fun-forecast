import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LocationSelectorComponent extends Component {
  @service router;
  @service api;
  @service location;
  @service metrics;

  @tracked error = '';
  @tracked suggestions = [];
  @tracked searchText = '';
  @tracked showRecents = true;
  
  constructor() {
    super(...arguments);

    const { initialSearch } = this.args;
    if (initialSearch) {
      this.searchText = initialSearch;
      this.fetchLocationSuggestions(initialSearch);
    }
  }

  trackEvent(name, opts = {}) {
    try {
      this.metrics.trackEvent(name, opts)
    } catch(e) {
      // swallow error and continue
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
    this.trackEvent('location_search_reset');
  }

  // TODO: concurrency for loading state
  @action
  searchForLocations(evt) {
    evt.preventDefault();
    const searchText = this.searchText;
    this.trackEvent('location_search', {
      keyword: encodeURIComponent(searchText)
    });
    this.fetchLocationSuggestions(searchText);
  }

  @action selectLocation(loc) {
    const [lng, lat] = loc.center;
    const locData = {
      id: `${lat},${lng}`,
      lat,
      lng,
      name: loc.text,
      full_name: loc.place_name,
      search: this.searchText,
    };
    this.trackEvent('location_search_selected', {
      keyword: encodeURIComponent(this.searchText),
      name: locData.name,
      place: locData.full_name,
    });
    this.args.onSelect(locData);
  }

  @action clearLocations() {
    this.location.clear();
    // Workaround for locations list not updating on display after clear
    this.showRecents = false;
    this.trackEvent('location_clear_cache');
  }
}
