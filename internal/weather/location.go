package weather

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func addHeaders(req *http.Request) {
	req.Header.Set("Accept", "application/geo+json")
	req.Header.Add("User-Agent", "(funforecast.com, chelshaw.dev@gmail.com)")
}

func getPreciseCoords(lat float64, lon float64) (string, string) {
	latStr := fmt.Sprintf("%.4f", lat)
	lonStr := fmt.Sprintf("%.4f", lon)
	return latStr, lonStr
}

func pointFromCoords(lat float64, lon float64) (*Point, error) {
	latS, lonS := getPreciseCoords(lat, lon)
	log.Println(latS)
	log.Println(lonS)
	// lon and lat are reversed order in the API
	url := fmt.Sprint("https://api.weather.gov/points/", lonS, ",", latS)
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
		log.Printf("Error from API: %s", resp.Status)
		return nil, fmt.Errorf("error from API: %s", resp.Status)
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
}
