import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LocationSelectorComponent extends Component {
  @service router;
  @service store;
  @service metrics;

  @tracked error = '';
  @tracked suggestions = [];
  @tracked searchText = '';

  constructor() {
    super(...arguments);

    const { initialSearch } = this.args;
    if (initialSearch) {
      this.searchText = initialSearch;
      this.fetchLocationSuggestions(initialSearch);
    }
  }

  get recentLocations() {
    return this.store.peekAll('location').filter(loc => !!loc.saved)
  }

  trackEvent(name, opts = {}) {
    try {
      this.metrics.trackEvent(name, opts);
    } catch (e) {
      // swallow error and continue
    }
  }

  async fetchLocationSuggestions(searchText) {
    this.suggestions = [];
    if (!searchText) return;
    
    try {
      const locs = await this.store.query('location', { keyword: searchText })
      this.suggestions = locs;
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
      keyword: encodeURIComponent(searchText),
    });
    this.fetchLocationSuggestions(searchText);
  }

  selectionSideEffects(model) {
    const existing = this.store.peekRecord('location', `${model.lat},${model.lng}`);
    if (existing) {
      return; // record exists already, skip save
    }
    // TODO: save to localStorage?
    this.store.pushPayload('location', {
      data: {
        id: `${model.lat},${model.lng}`,
        type: 'location',
        attributes: {
          lat: model.lat,
          lng: model.lng,
          name: model.name,
          full_name: model.fullName,
          saved: true,
        }
      }
    })
  }

  @action selectLocation(model) {
    this.trackEvent('location_search_selected', {
      keyword: encodeURIComponent(this.searchText),
      name: model.name,
      fullName: model.fullName,
    }); 
    this.selectionSideEffects(model)
    this.args.onSelect(model.id);
  }

  @action clearLocations() {
    this.store.unloadAll('location');
    this.trackEvent('location_clear_cache');
  }
}
