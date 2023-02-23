package weather

import "time"

var WeatherMap = map[int]string{
	0: "clear",
	1: "mostly clear",
	2: "partly clear",
	3: "partly cloudy",
	4: "mostly cloudy",
	5: "cloudy",
	6: "fog",
	7: "rain",
	8: "storm",
}
type Location struct {
	LocationKey     string		`json:"location_key"`
	LocationName 	string		`json:"location_name"`
	Lat 			float64
	Long 			float64
}

type HourData struct {
	Units       string
	Timezone    string
	Location    string
	Start       time.Time
	End         time.Time
	Daytime     bool
	Temp        int
	Wind        int
	Weather     string
	WeatherCode int
}

// TODO: How to flatten from nested json to flattened struct?

// eg https://api.weather.gov/points/36.8637,-78.5324
type Point struct {
	Properties struct{
		Id string `json:"gridId"`
		X  int    `json:"gridX"`
		Y  int    `json:"gridY"`
		RelativeLocation struct {
			Properties struct {
				City string `json:"city"`
				State string `json:"state"`
			} `json:"properties"`
		} `json:"relativeLocation"`
		Timezone string `json:"timeZone"`
	} `json:"properties"`
}

// From api.weather.gov forecast/hourly
// https://api.weather.gov/gridpoints/EWX/137,72/forecast/hourly?units=us
type WeatherData struct {
	Properties struct{
		Periods []struct{
			StartTime	string `json:"startTime"`
			EndTime	string `json:"endTime"`
			IsDaytime bool `json:"isDaytime"`
			Temperature int `json:"temperature"`
			TemperatureUnit string `json:"temperatureUnit"`
			WindSpeed string `json:"windSpeed"`
			WeatherStr string `json:"shortForecast"`
		} `json:"periods"`
	}
}

type WeatherPeriod struct {
	StartTime	string `json:"startTime"`
	EndTime	string `json:"endTime"`
	IsDaytime bool `json:"isDaytime"`
	Temperature int `json:"temperature"`
	TemperatureUnit string `json:"temperatureUnit"`
	WindSpeed string `json:"windSpeed"`
	WeatherStr string `json:"shortForecast"`
}
