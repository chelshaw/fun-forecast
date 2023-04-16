import datetime
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, Any


@dataclass
class ResponseObject:
    data: Any

class WeatherCondition(Enum):
    UNKNOWN = -1
    CLEAR = 0
    MOSTLY_CLEAR = 1
    PARTLY_CLEAR = 2
    PARTLY_CLOUDY = 3
    MOSTLY_CLOUDY = 4
    CLOUDY = 5
    FOG = 6
    RAIN = 7
    STORM = 8
    SNOW = 9
    SLEET = 10
    HAIL = 11
    ICE = 12


@dataclass
class HourData:
    temp: int
    wind: int
    # timezone: Optional[datetime.timezone]
    start: datetime.datetime
    end: datetime.datetime
    isDaytime: bool
    weatherStr: str
    weatherCode: WeatherCondition
    score: Optional[int] = None
    score_reasons: Optional[list] = field(default_factory=list)
    score_reasons_prohibited: Optional[list] = field(default_factory=list)
    unit: str = None
