import datetime
from dataclasses import dataclass
from enum import Enum
from typing import Optional


class WeatherCondition(Enum):
    CLEAR = 0
    MOSTLY_CLEAR = 1
    PARTLY_CLEAR = 2
    PARTLY_CLOUDY = 3
    MOSTLY_CLOUDY = 4
    CLOUDY = 5
    FOG = 6
    RAIN = 7
    STORM = 8
    UNKNOWN = 9


@dataclass
class HourData:
    temp: int
    wind: int
    timezone: Optional[datetime.timezone]
    start: datetime.datetime
    end: datetime.datetime
    daytime: bool
    weatherStr: str
    weatherCode: WeatherCondition
    score: Optional[int] = None
    unit: str = None
