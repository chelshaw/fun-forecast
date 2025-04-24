package main

import (
	"encoding/json"
	"io"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/chelshaw/fun-forecast/internal/weather"
	"github.com/gorilla/mux"
	"github.com/honeycombio/otel-config-go/otelconfig"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

func rolldice(w http.ResponseWriter, r *http.Request) {
	roll := 1 + rand.Intn(6)

	resp := strconv.Itoa(roll) + "\n"
	if _, err := io.WriteString(w, resp); err != nil {
		log.Printf("Write failed: %v\n", err)
	}
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

// func instrHandler(n string, h func(w http.ResponseWriter, r *http.Request)) http.Handler {
// 	handler := http.HandlerFunc(h)
// 	return otelhttp.NewHandler(handler, n)
// }

func instantiateApp() {
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// an example API handler
		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	}).Methods("GET")

	handler := http.HandlerFunc(rolldice)
	diceHandler := otelhttp.NewHandler(handler, "rolldice")
	r.HandleFunc("/rolldice", diceHandler.ServeHTTP).Methods("GET")
	// weatherHandler := instrHandler("getWeather", weather.GetWeather)
	wHandler := http.HandlerFunc(weather.GetWeather)
	weatherHandler := otelhttp.NewHandler(wHandler, "getWeather")
	r.HandleFunc("/weather/{lat}/{lon}", weatherHandler.ServeHTTP).Methods("GET")

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
