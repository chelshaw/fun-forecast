from typing import Bool, List
from enum import Enum
import datetime
from dataclasses import dataclass


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
class Location:
    LocationKey: str
    LocationName: str
    Lat: float
    Long: float


# Weather API Point
@dataclass
class WeatherApiPointLocationProperties:
    city: str
    state: str


@dataclass
class WeatherApiRelativeLocation:
    properties: WeatherApiPointLocationProperties


@dataclass
class WeatherApiPointProperties:
    gridId: str
    gridX: int
    gridY: int
    relativeLocation: WeatherApiRelativeLocation
    timeZone: str


@dataclass
class WeatherApiPoint:
    properties: WeatherApiPointProperties


# Weather Data
@dataclass
class Period:
    startTime: str
    endTime:	str
    isDaytime: Bool
    temperature: int
    temperatureUnit: str
    windSpeed: str
    shortforecast: str


@dataclass
class WeatherDataProperties:
    periods: List[Period]


@dataclass
class WeatherData:
    properties: WeatherDataProperties


@dataclass
class HourData:
    unit: str = None
    timezone: str
    location: str
    start: datetime.datetime
    end: datetime.datetime
    daytime: bool
    temp: int
    wind: int
    weather: str
    condition: WeatherCondition
