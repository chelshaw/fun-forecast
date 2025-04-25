package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/chelshaw/fun-forecast/internal/activities"
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

func weatherHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// get valid lat/lon from URL
	vars, err := requiredVars(mux.Vars(r), "lat", "lon")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// latStr, latExists := vars["lat"]
	// if !latExists || latStr == "" {
	// 	// span.SetStatus(codes.Error, "Missing or invalid latitude")
	// 	http.Error(w, "Missing or invalid latitude", http.StatusBadRequest)
	// 	return
	// }

	// lonStr, lonExists := vars["lon"]
	// if !lonExists || lonStr == "" {
	// 	http.Error(w, "Missing or invalid longitude", http.StatusBadRequest)
	// 	return
	// }
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

	// get valid lat/lon from URL
	// vars, err := requiredVars(mux.Vars(r), "activity")
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// lat, err := strconv.ParseFloat(vars["lat"], 64)
	// if err != nil {
	// 	http.Error(w, "Invalid latitude", http.StatusBadRequest)
	// 	return
	// }
	// lon, err := strconv.ParseFloat(vars["lon"], 64)
	// if err != nil {
	// 	http.Error(w, "Invalid longitude", http.StatusBadRequest)
	// 	return
	// }

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
