package activities

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
)

type ActivitySchema struct {
	Verb            string                   `json:"verb"`
	Wind            Range                    `json:"wind"`
	Temp            Range                    `json:"temp"`
	Conditions      map[string]ConditionRule `json:"conditions"`
	LightConditions map[string]bool          `json:"light_conditions"`
}

type ConditionRule struct {
	Type      string  `json:"type"`                 // "gaussian" or "fixed"
	IdealTemp float64 `json:"ideal_temp,omitempty"` // used only for "gaussian"
	Sigma     float64 `json:"sigma,omitempty"`      // used only for "gaussian"
	Score     float64 `json:"score"`                // used only for "fixed"
}

type Range struct {
	Min   int    `json:"min"`
	Ideal int    `json:"ideal"`
	Max   int    `json:"max"`
	Unit  string `json:"units"`
}

type WeatherConditions struct {
	Never      []string       `json:"never"`
	Acceptable map[string]int `json:"acceptable"`
}

type LightConditions struct {
	Daytime   bool `json:"daytime"`
	NightTime bool `json:"nighttime"`
}

var tracer = otel.Tracer("funforecast.activities")

func GetMotoSchema(ctx context.Context) (*ActivitySchema, error) {
	ctx, span := tracer.Start(ctx, "GetMotoSchema")
	defer span.End()
	activity, err := getActivitySchema(ctx, "moto")
	if activity == nil {
		span.RecordError(fmt.Errorf("activity schema is nil"))
		span.SetStatus(codes.Error, "activity schema is nil")
		return nil, fmt.Errorf("activity schema is nil")
	} else if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	return activity, nil
}

func getActivitySchema(ctx context.Context, name string) (*ActivitySchema, error) {
	_, span := tracer.Start(ctx, "getActivitySchema")
	defer span.End()
	span.SetAttributes(
		attribute.String("activity.req.name", name),
	)
	activity := ActivitySchema{}
	// Get the directory of the current source file
	execDir, err := os.Getwd()
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	// Construct the absolute path to the JSON file
	path := fmt.Sprintf("%s/internal/activities/%s.json", execDir, name)
	span.SetAttributes(
		attribute.String("activity.req.path", path),
	)
	jsonFile, err := os.Open(path)
	// if os.Open returns an error then handle it
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	byteValue, _ := io.ReadAll(jsonFile)

	var result map[string]interface{}
	json.Unmarshal(byteValue, &result)
	fmt.Println(result)
	json.Unmarshal(byteValue, &activity)

	return &activity, nil
}
