package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"

	"github.com/chelshaw/fun-forecast/internal/tracehttp"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
)

func weatherHeaders() *map[string]string {
	return &map[string]string{
		"Accept":     "application/geo+json",
		"User-Agent": "(funforecast.com, chelshaw.dev@gmail.com)",
	}
}

func getPreciseCoords(lat float64, lon float64) (string, string) {
	latStr := fmt.Sprintf("%.4f", lat)
	lonStr := fmt.Sprintf("%.4f", lon)
	return latStr, lonStr
}

func pointFromCoords(ctx context.Context, lat float64, lon float64) (*Point, error) {
	ctx, span := tracer.Start(ctx, "pointFromCoords")
	defer span.End()

	latS, lonS := getPreciseCoords(lat, lon)
	span.SetAttributes(
		attribute.String("weather.req.lat_precise", latS),
		attribute.String("weather.req.lon_precise", lonS),
	)

	client := tracehttp.NewTracingClient()
	url := fmt.Sprint("https://api.weather.gov/points/", latS, ",", lonS)
	resp, err := client.Get(ctx, url, *weatherHeaders())
	// map[string]string{
	// 	"Accept":     "application/geo+json",
	// 	"User-Agent": "(funforecast.com, chelshaw.dev@gmail.com)",
	// }
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		span.RecordError(fmt.Errorf("API Error: %s", string(body)))
		span.SetStatus(codes.Error, resp.Status)
		return nil, fmt.Errorf("could not get point from coordinates")
	}
	defer resp.Body.Close()

	var apiResponse PointApiResponse
	err = json.NewDecoder(resp.Body).Decode(&apiResponse)
	if err != nil {
		log.Printf("Error decoding API response: %v", err)
		return nil, err
	}
	p := &Point{
		GridId:   apiResponse.Properties.GridId,
		GridX:    apiResponse.Properties.GridX,
		GridY:    apiResponse.Properties.GridY,
		Lat:      apiResponse.Properties.RelativeLocation.Geometry.Coordinates[1],
		Lon:      apiResponse.Properties.RelativeLocation.Geometry.Coordinates[0],
		Timezone: apiResponse.Properties.TimeZone,
		City:     apiResponse.Properties.RelativeLocation.Properties.City,
		State:    apiResponse.Properties.RelativeLocation.Properties.State,
	}
	return p, nil
}

type PointApiResponse struct {
	Properties struct {
		GridId           string `json:"gridId"`
		GridX            int    `json:"gridX"`
		GridY            int    `json:"gridY"`
		RelativeLocation struct {
			Properties struct {
				City  string `json:"city"`
				State string `json:"state"`
			} `json:"properties"`
			Geometry struct {
				Coordinates []float64 `json:"coordinates"`
			} `json:"geometry"`
		} `json:"relativeLocation"`
		TimeZone string `json:"timeZone"`
	} `json:"properties"`
}

type Point struct {
	GridId   string  `json:"grid_id,omitempty"`
	GridX    int     `json:"grid_x,omitempty"`
	GridY    int     `json:"grid_y,omitempty"`
	Lat      float64 `json:"lat,omitempty"`
	Lon      float64 `json:"lon,omitempty"`
	Timezone string  `json:"timezone,omitempty"`
	City     string  `json:"city,omitempty"`
	State    string  `json:"state,omitempty"`
}
