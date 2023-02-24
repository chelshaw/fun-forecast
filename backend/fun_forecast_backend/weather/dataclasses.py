from dataclasses import dataclass


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
