import json
from typing import Dict

import dacite

from .dataclasses import ActivitySchema

activity_map: Dict[str, str] = {
    "MOTORCYCLE": "motorbike",
    "HIKE": "hike",
    "BICYCLE": "bicycle",
    "GOLF": "golf",
    "KAYAK": "kayak",
    "PICKLEBALL": "pickleball",
    "TENNIS": "tennis",
    "PICNIC": "picnic",
    "RUN": "run",
    "SKATEBOARD": "skateboard",
    "SWIM": "swim",
    "WALK": "walk",
}


def get_activity_schema_by_key(key: str) -> ActivitySchema:
    if key not in activity_map:
        raise KeyError

    path = "../resources/activity-schemas/" + activity_map[key] + ".json"
    try:
        with open(path) as f:
            json_data = json.load(f)
    except:
        logger.error(f"Unable to open file {path}")
        raise FileNotFoundError

    return dacite.from_dict(ActivitySchema, json_data)
