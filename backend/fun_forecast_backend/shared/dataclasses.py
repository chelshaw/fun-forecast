from dataclasses import dataclass
import datetime
from enum import Enum


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
    timezone: str
    location: str
    start: datetime.datetime
    end: datetime.datetime
    daytime: bool
    temp: int
    wind: int
    weather: str
    condition: WeatherCondition
    score: int = None
    unit: str = None
