package weather

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"

	"go.opentelemetry.io/otel/attribute"
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
	IsDaytime   bool    `json:"daytime"`
	WeatherStr  string  `json:"forecast"`
	WeatherCode string  `json:"weather_code"`
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

var weatherCodes = map[string]string{
	"clear":         "CLEAR",
	"mostly_clear":  "MOSTLY_CLEAR",
	"partly_cloudy": "PARTLY_CLOUDY",
	"cloud":         "CLOUDY",
	"storm":         "STORM",
	"rain":          "RAINY",
	"snow":          "SNOW",
	"fog":           "FOG",
	"unknown":       "UNKNOWN",
}

func getWeatherCode(ctx context.Context, shortForecast string) string {
	_, span := tracer.Start(ctx, "getWeatherCode")
	defer span.End()
	span.SetAttributes(attribute.String("weather.req.short_forecast", shortForecast))
	f := strings.ToLower(shortForecast)
	c := weatherCodes["unknown"]

	if f == "mostly sunny" || f == "mostly clear" {
		c = weatherCodes["clear"]
	} else if f == "partly sunny" || f == "partly cloudy" {
		c = weatherCodes["partly_cloudy"]
	} else if strings.Contains(f, "storm") {
		// TODO: storm intensity?
		c = weatherCodes["storm"]
	} else if strings.Contains(f, "rain") || strings.Contains(f, "shower") {
		c = weatherCodes["rain"]
	} else if strings.Contains(f, "snow") {
		c = weatherCodes["snow"]
	} else if strings.Contains(f, "sun") || strings.Contains(f, "clear") {
		c = weatherCodes["clear"]
	} else if strings.Contains(f, "cloud") {
		c = weatherCodes["cloud"]
	} else if strings.Contains(f, "fog") {
		c = weatherCodes["fog"]
	} else if strings.Contains(f, "wind") {
		c = weatherCodes["wind"]
	}
	span.SetAttributes(attribute.String("weather.req.weather_code", c))
	return c
}

// Function to parse the API response and save it into a struct
func parseWeatherApiResponse(ctx context.Context, apiResponse *WeatherApiResponse) (*[]HourData, error) {
	ctx, span := tracer.Start(ctx, "parseWeatherApiResponse")
	defer span.End()
	var d []HourData
	for i, v := range apiResponse.Properties.Periods {
		fmt.Println(i, v)
		h := HourData{
			Temperature: v.Temperature,
			WindRange:   parseWind(v.WindSpeed),
			Start:       v.StartTime,
			End:         v.EndTime,
			IsDaytime:   v.IsDaytime,
			WeatherStr:  getWeatherCode(ctx, v.ShortForecast),
			WeatherCode: v.Icon,
			Unit:        v.TemperatureUnit,
		}
		d = append(d, h)
		log.Printf("Parsed weather data: %v", h)
	}
	return &d, nil
}
