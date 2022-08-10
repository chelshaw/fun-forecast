package weather

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
