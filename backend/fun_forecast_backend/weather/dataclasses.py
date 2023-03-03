from dataclasses import dataclass
from typing import Bool, List


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
# type Point struct {
# 	Properties struct{

# 	} `json:"properties"`
# }

# // From api.weather.gov forecast/hourly
# // https://api.weather.gov/gridpoints/EWX/137,72/forecast/hourly?units=us
# type WeatherData struct {
# 	Properties struct{
# 		Periods []struct{
# 			StartTime	string `json:"startTime"`
# 			EndTime	string `json:"endTime"`
# 			IsDaytime bool `json:"isDaytime"`
# 			Temperature int `json:"temperature"`
# 			TemperatureUnit string `json:"temperatureUnit"`
# 			WindSpeed string `json:"windSpeed"`
# 			WeatherStr string `json:"shortForecast"`
# 		} `json:"periods"`
# 	}
# }
