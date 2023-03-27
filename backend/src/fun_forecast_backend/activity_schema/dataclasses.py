from dataclasses import dataclass
from typing import List, Dict


@dataclass
class Wind:
    min: int
    max: int
    ideal: int
    units: str


@dataclass
class Temp:
    min: int
    max: int
    ideal: int
    units: str


@dataclass
class WeatherConditions:
    acceptable: Dict[str, int]
    never: List[str]


@dataclass
class LightConditions:
    daytime: bool
    nighttime: bool


@dataclass
class ActivitySchema:
    verb: str
    wind: Wind
    temp: Temp
    weather_conditions: WeatherConditions
    light_conditions: LightConditions
