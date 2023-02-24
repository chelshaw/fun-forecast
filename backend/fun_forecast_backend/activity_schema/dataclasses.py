from dataclasses import dataclass
from typing import List


@dataclass
class Range:
	low: int
	high: int
	with_weather: List[int]


@dataclass
class ActivitySchema:
	verb: str
	temp_unit: str
	duration: int
	temp_never_below: int
	temp_never_above: int
	wind_never_below: int
	wind_never_above: int
	weather_never: List[str] 
	daytime_only: bool     
	ranges: List[Range]

