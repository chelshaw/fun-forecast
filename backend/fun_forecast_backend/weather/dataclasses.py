from typing import List

from dataclasses import dataclass
import datetime


@dataclass
class WeatherApiPointProperties:
    city: str
    state: str


@dataclass
class WeatherApiRelativeLocation:
    properties: WeatherApiPointProperties


@dataclass
class WeatherApiPoint:
    gridId: str
    gridX: int
    gridY: int
    relativeLocation: WeatherApiRelativeLocation
    timezone: str


@dataclass
class WeatherDataPeriod:
    startTime: str
    endTime: str
    isDaytime: bool
    temperature: int
    temperatureUnit: str
    windSpeed: str
    shortForecast: str


@dataclass
class WeatherDataProperties:
    periods: List[WeatherDataPeriod]


@dataclass
class WeatherData:
    properties: WeatherDataProperties


@dataclass
class HourData:
    unit: str
    timezone: str
    location: str
    start: datetime.datetime
    end: datetime.datetime
    daytime: bool
    temp: int
    wind: int
    weather: str
    weatherCode: int
