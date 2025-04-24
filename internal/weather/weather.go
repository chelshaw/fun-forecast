package weather

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func GetWeather(w http.ResponseWriter, r *http.Request) {
	log.Println("getWeather called")
	vars := mux.Vars(r)
	latStr, latExists := vars["lat"]
	if !latExists || latStr == "" {
		http.Error(w, "Missing or invalid latitude", http.StatusBadRequest)
		return
	}

	lonStr, lonExists := vars["lon"]
	if !lonExists || lonStr == "" {
		http.Error(w, "Missing or invalid longitude", http.StatusBadRequest)
		return
	}
	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		http.Error(w, "Invalid latitude", http.StatusBadRequest)
		return
	}
	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		http.Error(w, "Invalid longitude", http.StatusBadRequest)
		return
	}
	log.Printf("URL params lat: %f, lon: %f", lat, lon)
	p, err := pointFromCoords(lat, lon)
	if err != nil {
		log.Printf("Error getting point from coordinates: %v", err)
		http.Error(w, "Failed getting point", http.StatusBadRequest)
		return
	}

	f, err := weatherForPoint(p)
	if err != nil {
		http.Error(w, "Error getting weather", http.StatusInternalServerError)
		return
	}
	// w := ParseWeatherApiResponse(f)

	// http.Error(w, "Done", http.StatusOK)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	// json.NewEncoder(w).Encode(map[string]float64{"lat": lat, "lon": lon})
	json.NewEncoder(w).Encode(f)
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

func weatherForPoint(p *Point) (*WeatherApiResponse, error) {
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
	err = json.NewDecoder(resp.Body).Decode(&apiResponse)
	if err != nil {
		log.Printf("Error decoding API response: %v", err)
		return nil, err
	}
	// h, err := parseWeatherApiResponse(&apiResponse)
	// if err != nil {
	// 	log.Printf("Error parsing API response: %v", err)
	// 	return nil, err
	// }
	return &apiResponse, nil
}
