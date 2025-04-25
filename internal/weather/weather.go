package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"

	"github.com/chelshaw/fun-forecast/internal/tracehttp"
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
	h, err := parseWeatherApiResponse(ctx, f)
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
	ctx, span := tracer.Start(ctx, "weatherForPoint")
	defer span.End()
	span.SetAttributes(
		attribute.String("weather.point.grid.id", p.GridId),
		attribute.Int("weather.point.grid.x", p.GridX),
		attribute.Int("weather.point.grid.y", p.GridY),
	)
	url := fmt.Sprintf("https://api.weather.gov/gridpoints/%s/%d,%d/forecast/hourly?units=us", p.GridId, p.GridX, p.GridY)
	client := tracehttp.NewTracingClient()
	resp, err := client.Get(ctx, url, map[string]string{
		"Accept":     "application/geo+json",
		"User-Agent": "(funforecast.com,chelshaw.dev@gmail.com)",
	})
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		span.RecordError(fmt.Errorf("API Error: %s", string(body)))
		span.SetStatus(codes.Error, resp.Status)
		return nil, fmt.Errorf("error from API: %s", resp.Status)
	}
	defer resp.Body.Close()

	var apiResponse WeatherApiResponse
	err = json.NewDecoder(resp.Body).Decode(&apiResponse)
	if err != nil {
		log.Printf("Error decoding API response: %v", err)
		return nil, err
	}

	return &apiResponse, nil
}
