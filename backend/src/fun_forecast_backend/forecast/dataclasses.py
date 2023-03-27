import datetime
from dataclasses import dataclass
from typing import List

from fun_forecast_backend.shared.dataclasses import WeatherCondition


@dataclass
class LocationInfo:
    ref: str
    sunrise: datetime.datetime
    sunset: datetime.datetime
    city: str
    state: str


@dataclass
class EvaluatedHour:
    start: datetime.datetime
    end: datetime.datetime
    score: float
    conditions: List[WeatherCondition]
    temperature: int
    wind: int
    unit: str


@dataclass
class Forecast:
    verb: str
    location: LocationInfo
    evaluated_hours: List[EvaluatedHour]
