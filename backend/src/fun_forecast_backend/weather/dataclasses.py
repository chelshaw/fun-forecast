from typing import List
from dataclasses import dataclass


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
    isDaytime: bool
    temperature: int
    temperatureUnit: str
    windSpeed: str
    shortForecast: str


@dataclass
class WeatherDataProperties:
    periods: List[Period]


@dataclass
class WeatherData:
    properties: WeatherDataProperties


@dataclass
class LatLongResponse:
    lat: float
    long: float
    name: str
    full_name: str
