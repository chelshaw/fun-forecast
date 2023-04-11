import Model, { attr } from '@ember-data/model';

export default class LocationModel extends Model {
  @attr('number') lat;
  @attr('number') lng;
  @attr('string') name;
  @attr('string') fullName;
  @attr('string') searchTerm;
  @attr('boolean') saved;
}
