package weather

// Struct definitions to match the JSON structure
type WeatherApiResponse struct {
	Context    []interface{} `json:"@context"`
	Type       string        `json:"type"`
	Geometry   Geometry      `json:"geometry"`
	Properties Properties    `json:"properties"`
}

type Geometry struct {
	Type        string        `json:"type"`
	Coordinates [][][]float64 `json:"coordinates"`
}

type Properties struct {
	Units             string    `json:"units"`
	ForecastGenerator string    `json:"forecastGenerator"`
	GeneratedAt       string    `json:"generatedAt"`
	UpdateTime        string    `json:"updateTime"`
	ValidTimes        string    `json:"validTimes"`
	Elevation         Elevation `json:"elevation"`
	Periods           []Period  `json:"periods"`
}

type Elevation struct {
	UnitCode string  `json:"unitCode"`
	Value    float64 `json:"value"`
}

type Period struct {
	Number                     int           `json:"number"`
	Name                       string        `json:"name"`
	StartTime                  string        `json:"startTime"`
	EndTime                    string        `json:"endTime"`
	IsDaytime                  bool          `json:"isDaytime"`
	Temperature                int           `json:"temperature"`
	TemperatureUnit            string        `json:"temperatureUnit"`
	TemperatureTrend           string        `json:"temperatureTrend"`
	ProbabilityOfPrecipitation Precipitation `json:"probabilityOfPrecipitation"`
	WindSpeed                  string        `json:"windSpeed"`
	WindDirection              string        `json:"windDirection"`
	Icon                       string        `json:"icon"`
	ShortForecast              string        `json:"shortForecast"`
	DetailedForecast           string        `json:"detailedForecast"`
}

type Precipitation struct {
	UnitCode string  `json:"unitCode"`
	Value    float64 `json:"value"`
}

type HourData struct {
	Temperature int    `json:"temp"`
	WindSpeed   string `json:"wind"` // eg "5 to 10 mph"
	Start       string `json:"start"`
	End         string `json:"end"`
	IsDaytime   bool   `json:"isDaytime"`
	WeatherStr  string `json:"weatherStr"`
	WeatherCode string `json:"weatherCode"`
	Unit        string `json:"unit"`
}

// Function to parse the API response and save it into a struct
func parseWeatherApiResponse(apiResponse *WeatherApiResponse) (*[]HourData, error) {
	var d []HourData
	for i, v := range apiResponse.Properties.Periods {
		h := HourData{
			Temperature: v.Temperature,
			WindSpeed:   v.WindSpeed,
			Start:       v.StartTime,
			End:         v.EndTime,
			IsDaytime:   v.IsDaytime,
			WeatherStr:  v.ShortForecast,
			WeatherCode: v.Icon,
			Unit:        v.TemperatureUnit,
		}
		d[i] = h
	}
	return &d, nil
}
