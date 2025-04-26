package forecast

import (
	"context"
	"fmt"
	"math"

	"github.com/chelshaw/fun-forecast/internal/activities"
	"github.com/chelshaw/fun-forecast/internal/weather"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
)

var tracer = otel.Tracer("funforecast.forecast")

// FuzzyScore returns a value between 0 and 1 that expresses how close
// a given value is to the ideal, based on a Gaussian membership function.
func FuzzyScore(ctx context.Context, value float64, ideal float64, sigma float64) float64 {
	ctx, span := tracer.Start(ctx, "FuzzyScore")
	defer span.End()
	span.SetAttributes(
		attribute.Float64("forecast.fuzzy.value", value),
		attribute.Float64("forecast.fuzzy.ideal", ideal),
		attribute.Float64("forecast.fuzzy.sigma", sigma),
	)
	if sigma == 0 {
		span.RecordError(fmt.Errorf("sigma must not be zero"))
		span.SetStatus(codes.Error, "sigma must not be zero")
		return 0 // or panic; sigma must not be zero
	}
	exponent := -math.Pow(value-ideal, 2) / (2 * math.Pow(sigma, 2))
	return math.Exp(exponent)
}

func ScoreCondition(ctx context.Context, conditions map[string]activities.ConditionRule, hour *weather.HourData) float64 {
	ctx, span := tracer.Start(ctx, "ScoreCondition")
	defer span.End()
	rule, ok := conditions[hour.WeatherStr]
	fmt.Println(hour.WeatherStr)
	if !ok {
		// Default to 1 if no condition is found, indicating no penalty
		return 1
	}
	switch rule.Type {
	case "gaussian":
		return FuzzyScore(ctx, float64(hour.Temperature), rule.IdealTemp, rule.Sigma)
	case "fixed":
		return rule.Score
	}
	fmt.Println("unknown condition type", rule.Type)
	return 0
}

func CombineScoresWeighted(ctx context.Context, tempScore float64, windScore float64, condScore float64, weights map[string]float64) (float64, error) {
	_, span := tracer.Start(ctx, "CombineScoresWeighted")
	defer span.End()

	tempWeight, ok1 := weights["temp"]
	windWeight, ok2 := weights["wind"]

	if !ok1 || !ok2 {
		return 0.0, fmt.Errorf("missing required weights: got %v", weights)
	}

	totalWeight := tempWeight + windWeight
	if totalWeight <= 0 {
		return 0.0, fmt.Errorf("invalid weight configuration: total weight must be > 0")
	}

	// Normalize weights if necessary (optional depending on how strictly you manage inputs)
	tempWeight /= totalWeight
	windWeight /= totalWeight

	finalScore := tempScore*tempWeight + windScore*windWeight
	return finalScore * condScore, nil
}

type Forecast struct {
	Verb        string  `json:"verb"`
	Score       float64 `json:"score"`
	Condition   string  `json:"condition"`
	WindRange   []int64 `json:"wind_range"`
	Temperature int     `json:"temperature"`
}

func EvaluateHour(ctx context.Context, h *weather.HourData, a *activities.ActivitySchema) (float64, error) {
	ctx, span := tracer.Start(ctx, "EvaluateHour")
	defer span.End()
	span.SetAttributes(
		h.InstrKv()...,
	)
	span.SetAttributes(
		a.InstrKv()...,
	)
	condScore := ScoreCondition(ctx, a.Conditions, h)
	if condScore == 0 {
		return 0, nil
	}
	tempScore := FuzzyScore(ctx, float64(h.Temperature), float64(a.Temp.Ideal), float64(a.Temp.Max-a.Temp.Min)/6)
	windScore := FuzzyScore(ctx, float64(h.WindRange[0]), float64(a.Wind.Ideal), 5)
	combined, err := CombineScoresWeighted(ctx, tempScore, windScore, condScore, map[string]float64{
		"temp": 0.7,
		"wind": 0.3,
	})
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return -1, err
	}
	span.SetAttributes(
		attribute.Int("forecast.hour.temp", h.Temperature),
		attribute.Float64("forecast.hour.temp_score", tempScore),
		attribute.Int64("forecast.hour.wind", h.WindRange[0]),
		attribute.Float64("forecast.hour.wind_score", windScore),
		attribute.String("forecast.hour.condition", h.WeatherStr),
		attribute.Float64("forecast.hour.cond_score", condScore),
		attribute.Float64("forecast.hour.combined_score", combined),
	)

	fmt.Println("tempScore", tempScore)
	fmt.Println("windScore", windScore)
	fmt.Println("combined", combined)
	fmt.Println("condScore", condScore)

	return combined, nil
}
