package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/chelshaw/fun-forecast/internal/activities"
	"github.com/chelshaw/fun-forecast/internal/forecast"
	"github.com/chelshaw/fun-forecast/internal/weather"
	"github.com/gorilla/mux"
	"github.com/honeycombio/otel-config-go/otelconfig"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

func requiredVars(v map[string]string, keys ...string) (map[string]string, error) {
	values := make(map[string]string)
	// check if all keys are present in the map
	for _, key := range keys {
		if _, ok := v[key]; !ok || v[key] == "" {
			return nil, fmt.Errorf("missing required key: %s", key)
		}
		values[key] = v[key]
	}
	return v, nil
}

func getForecast(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	d := weather.ExampleHourData()
	a, _ := activities.GetMotoSchema(ctx)
	f, _ := forecast.EvaluateHour(ctx, d, a)
	// if err != nil {
	// 	http.Error(w, "Error getting activity", http.StatusInternalServerError)
	// 	return
	// }

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"weather":  d,
		"activity": a,
		"forecast": f,
	})
}

func weatherHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// get valid lat/lon from URL
	vars, err := requiredVars(mux.Vars(r), "lat", "lon")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	lat, err := strconv.ParseFloat(vars["lat"], 64)
	if err != nil {
		http.Error(w, "Invalid latitude", http.StatusBadRequest)
		return
	}
	lon, err := strconv.ParseFloat(vars["lon"], 64)
	if err != nil {
		// span.RecordError(err)
		// span.SetStatus(codes.Error, err.Error())
		http.Error(w, "Invalid longitude", http.StatusBadRequest)
		return
	}

	h, err := weather.GetWeather(ctx, lat, lon)
	if err != nil {
		// span.RecordError(err)
		// span.SetStatus(codes.Error, err.Error())
		http.Error(w, "Error getting weather", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(h)
}

func motoHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	a, err := activities.GetMotoSchema(ctx)
	if err != nil {
		http.Error(w, "Error getting activity", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(a)
}

func main() {
	// use otelconfig to setup OpenTelemetry SDK
	otelShutdown, err := otelconfig.ConfigureOpenTelemetry()
	if err != nil {
		log.Fatalf("error setting up OTel SDK - %e", err)
	}
	defer otelShutdown()
	instantiateApp()
}

func instrHandler(n string, h func(w http.ResponseWriter, r *http.Request)) http.Handler {
	handler := http.HandlerFunc(h)
	return otelhttp.NewHandler(handler, n)
}

func instantiateApp() {
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// an example API handler
		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	}).Methods("GET")
	weatherHandler := instrHandler("getWeather", weatherHandler)
	r.HandleFunc("/weather/{lat}/{lon}", weatherHandler.ServeHTTP).Methods("GET")
	activityHandler := instrHandler("motoHandler", motoHandler)
	r.HandleFunc("/activity/moto", activityHandler.ServeHTTP).Methods("GET")
	forecastHandler := instrHandler("getForecast", getForecast)
	r.HandleFunc("/forecast", forecastHandler.ServeHTTP).Methods("GET")

	srv := &http.Server{
		Handler: r,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Starting server on :8000")
	log.Fatal(srv.ListenAndServe())
}
