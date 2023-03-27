import json
from typing import Dict

import dacite

from fun_forecast_backend.activity_schema.dataclasses import ActivitySchema
from fun_forecast_backend.core.standard_logger import get_logger


logger = get_logger()

activity_map: Dict[str, str] = {
    "MOTORCYCLE": "motorbike.json",
    "HIKE": "hike.json",
    # "KAYAK": "kayak.json",
    # "RUN": "run.json",
    # "HORSE": "horse.json",
}


def get_activity_schema_by_key(key: str) -> ActivitySchema:
    key = key.upper()
    if key not in activity_map:
        logger.error(f"Activity key '{key}' not in activity_map: {activity_map.keys()} ")
        raise KeyError

    path = "../resources/activity-schemas/" + activity_map[key]
    try:
        with open(path) as f:
            json_data = json.load(f)
    except:
        logger.error(f"Unable to open file {path}")
        raise FileNotFoundError

    return dacite.from_dict(ActivitySchema, json_data)
