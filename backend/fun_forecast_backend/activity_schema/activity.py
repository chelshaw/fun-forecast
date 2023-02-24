import json
from typing import Dict

import dacite

from .dataclasses import ActivitySchema


activity_map: Dict[str, str] = {
    "MOTORCYCLE": "../../resources/activity-schemas/motorbike.json",
    "HIKE": "../../resources/activity-schemas/hike.json",
    # "KAYAK": "../../resources/activity-schemas/kayak.json",
    # "RUN": "../../resources/activity-schemas/run.json",
    # "HORSE": "../../resources/activity-schemas/horse.json",
}


def get_activity_schema_by_key(key: str) -> ActivitySchema:
    if key not in activity_map:
        raise KeyError

        # add file exists check
    json_data = json.load(activity_map[key])
    return dacite.from_dict(ActivitySchema, json_data)
