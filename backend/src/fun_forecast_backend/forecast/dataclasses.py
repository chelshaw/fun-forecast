import datetime
from dataclasses import dataclass, field
from typing import List

from fun_forecast_backend.shared.dataclasses import HourData

# TODO: Get this cleared up with Chelsea
# @dataclass
# class LocationInfo:
#     ref: str
#     sunrise: datetime.datetime
#     sunset: datetime.datetime
#     city: str
#     state: str


@dataclass
class Forecast:
    verb: str
    # location: LocationInfo
    evaluated_hours: List[HourData] = field(default_factory=list)
