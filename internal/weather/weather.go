package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
)

// Top-level handlers go here

var tracer trace.Tracer

func GetWeather(ctx context.Context, lat float64, lon float64) (*[]HourData, error) {
	tracer = otel.Tracer("funforecast.weather") // if not already in scope
	ctx, span := tracer.Start(ctx, "GetWeather")
	defer span.End()

	span.SetAttributes(attribute.Float64("weather.req.lat", lat))
	span.SetAttributes(attribute.Float64("weather.req.lon", lon))

	// get point from lat/lon
	p, err := pointFromCoords(ctx, lat, lon)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	span.SetAttributes(attribute.String("weather.point.city", p.City))
	span.SetAttributes(attribute.String("weather.point.state", p.State))

	// get weather for point
	f, err := weatherForPoint(ctx, p)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}

	// parse the weather response
	h, err := parseWeatherApiResponse(f)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}

	return h, nil
}

// func forecastForLatLon(lat float64, lon float64) (*WeatherApiResponse, error) {
// 	p, err := pointFromCoords(lat, lon)
// 	if err != nil {
// 		log.Printf("Error getting point from coordinates: %v", err)
// 		return nil, err
// 	}

// 	w, err := weatherForPoint(p)
// 	if err != nil {
// 		log.Printf("Error getting weather for point: %v", err)
// 		return nil, err
// 	}
// 	return w, nil
// }

func weatherForPoint(ctx context.Context, p *Point) (*WeatherApiResponse, error) {
	_, span := tracer.Start(ctx, "weatherForPoint")
	defer span.End()
	span.SetAttributes(
		attribute.String("weather.point.grid.id", p.GridId),
		attribute.Int("weather.point.grid.x", p.GridX),
		attribute.Int("weather.point.grid.y", p.GridY),
	)
	url := fmt.Sprintf("https://api.weather.gov/gridpoints/%s/%d,%d/forecast/hourly?units=us", p.GridId, p.GridX, p.GridY)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Error creating request: %v", err)
		return nil, err
	}
	addHeaders(req)
	resp, err := http.Get(url)

	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("error from API: %s", resp.Status)
	}
	defer resp.Body.Close()

	var apiResponse WeatherApiResponse
	// var apiResponse map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&apiResponse)
	if err != nil {
		log.Printf("Error decoding API response: %v", err)
		return nil, err
	}

	// TODO: This is broken
	// h, err := parseWeatherApiResponse(&apiResponse)
	// if err != nil {
	// 	log.Printf("Error parsing API response: %v", err)
	// 	return nil, err
	// }
	return &apiResponse, nil
}
