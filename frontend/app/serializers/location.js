import JSONAPISerializer from '@ember-data/serializer/json-api';
import { decamelize } from '@ember/string';

export default class LocationSerializer extends JSONAPISerializer {
  keyForAttribute(key, method) {
    return decamelize(key);
  }

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    const { modelName } = primaryModelClass;
    if (requestType === 'query') {
      const data = payload.data.map((raw, idx) => {
        const [lat, lng] = raw.center;
        return {
          type: modelName,
          id: `${lat},${lng}-${idx}`,
          attributes: {
            lat,
            lng,
            name: raw.text,
            full_name: raw.place_name,
            search_term: raw.search_term,
          },
        };
      });
      return super.normalizeResponse(
        store,
        primaryModelClass,
        { data },
        id,
        requestType
      );
    }
    return super.normalizeResponse(...arguments);
  }
}
