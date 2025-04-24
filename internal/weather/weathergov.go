package weather

import (
	"log"
	"strconv"
	"strings"
)

// Struct definitions to match the JSON structure
type WeatherApiResponse struct {
	// Context    []interface{} `json:"@context"`
	Type string `json:"type"`
	// Geometry   Geometry      `json:"geometry"`
	Properties Properties `json:"properties"`
}

type Geometry struct {
	Type        string        `json:"type"`
	Coordinates [][][]float64 `json:"coordinates"`
}

type Properties struct {
	Units             string `json:"units"`
	ForecastGenerator string `json:"forecastGenerator"`
	GeneratedAt       string `json:"generatedAt"`
	UpdateTime        string `json:"updateTime"`
	// ValidTimes        string    `json:"validTimes"`
	// Elevation         Elevation `json:"elevation"`
	// Periods           []Period  `json:"periods"`
	Periods []Period `json:"periods"`
}

type Elevation struct {
	UnitCode string  `json:"unitCode"`
	Value    float64 `json:"value"`
}

type Period struct {
	StartTime                  string        `json:"startTime"`
	EndTime                    string        `json:"endTime"`
	Icon                       string        `json:"icon"`
	IsDaytime                  bool          `json:"isDaytime"`
	Temperature                int           `json:"temperature"`
	TemperatureUnit            string        `json:"temperatureUnit"`
	ProbabilityOfPrecipitation Precipitation `json:"probabilityOfPrecipitation"`
	WindSpeed                  string        `json:"windSpeed"`
	ShortForecast              string        `json:"shortForecast"`
}

type Precipitation struct {
	UnitCode string  `json:"unitCode"`
	Value    float64 `json:"value"`
}

type HourData struct {
	Temperature int     `json:"temp"`
	WindRange   []int64 `json:"wind"` // eg "5 to 10 mph" => [5, 10]
	Start       string  `json:"start"`
	End         string  `json:"end"`
	IsDaytime   bool    `json:"isDaytime"`
	WeatherStr  string  `json:"weatherStr"`
	WeatherCode string  `json:"weatherCode"`
	Unit        string  `json:"unit"`
}

func parseWind(ws string) []int64 {
	s := strings.Fields(ws)
	var wr []int64

	for _, v := range s {
		i, err := strconv.ParseInt(v, 10, 64)
		if err == nil {
			log.Printf("Parsed wind speed: %v to %v", v, i)
			wr = append(wr, i)
		}
	}

	return wr
}

// Function to parse the API response and save it into a struct
// func parseWeatherApiResponse(apiResponse *WeatherApiResponse) (*[]HourData, error) {
// 	var d []HourData
// 	for i, v := range apiResponse.Properties.Periods {
// 		fmt.Println(i, v)
// 		h := HourData{
// 			Temperature: v.Temperature,
// 			WindRange:   parseWind(v.WindSpeed),
// 			Start:       v.StartTime,
// 			End:         v.EndTime,
// 			IsDaytime:   v.IsDaytime,
// 			WeatherStr:  v.ShortForecast,
// 			WeatherCode: v.Icon,
// 			Unit:        v.TemperatureUnit,
// 		}
// 		d[i] = h
// 	}
// 	return &d, nil
// }
