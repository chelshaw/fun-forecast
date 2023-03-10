from typing import List
import datetime
from dataclasses import dataclass

from shared.dataclasses import HourData, WeatherCondition


@dataclass
class LocationInfo:
    ref: str
    sunrise: datetime.datetime
    sunset: datetime.datetime
    city: str
    state: str


@dataclass
class NewForecastOutput:
    verb: str
    location: LocationInfo
    forecast: List[HourData]


@dataclass
class HourForecast:
    start: datetime.datetime
    end: datetime.datetime
    score: int
    conditions: List[WeatherCondition]
    temperature: int
    wind:		int
    unit: 		str
