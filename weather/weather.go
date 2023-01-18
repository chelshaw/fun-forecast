package weather

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Location struct {
	LocationKey     string				`json:"location_key"`
	LocationName string			`json:"location_name"`
	Lat float64
	Long float64
}

// TODO: Move this to new location section
// func getLocFromAddress(zipcode string) (Location) {
// 	// DOCS: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
	
// 	url := fmt.Sprintf("https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=%sformat=json&benchmark=4")
// 	resp, err := http.Get(url)
// 	if err != nil {
// 		fmt.Println("\n\nERROR getPointFromCoords!")
// 		return w, err
// 	}
// 	defer resp.Body.Close()
// }

// TODO: Fix pointers in this file

func PointFromCoords(lat string, lng string) (w Point, e error) {
	url := fmt.Sprintf("https://api.weather.gov/points/%s,%s", lat, lng)
	fmt.Println("DEBUG Fetching point from url w/ coords", url)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("\n\nERROR getPointFromCoords!")
		return w, err
	}
	defer resp.Body.Close()

	var j Point
	err = json.NewDecoder(resp.Body).Decode(&j)
	if err != nil {
		return w, err // TODO: Test if this fails ok without the pointer
	}
	fmt.Printf("DEBUG Point from coords: %v", j)
	return j, nil
}

func WeatherFromPoint(p Point) (w WeatherData, err error) {
	url := fmt.Sprintf("https://api.weather.gov/gridpoints/%s/%v,%v/forecast/hourly?units=us", p.Properties.Id, p.Properties.X, p.Properties.Y)
	fmt.Println("FETCHING DATA FROM:", url)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("\n\nERROR getWeatherFromPoint!")
		panic(err)
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(&w)
	if err != nil {
		return w, err // TODO: Test if this fails ok without the pointer
	}
	// TODO: Add location and timezone here?
	return
}

func ForecastForCoords(lat string, lng string) (hours []*HourData, err error) {
	point, err := PointFromCoords(lat, lng)
	if err != nil {
		return hours, err
	}
	weather, err := WeatherFromPoint(point)
	if err != nil {
		return hours, err
	}
	for i := 0; i < len(weather.Properties.Periods); i++ {
		hour, err := PeriodToHourData(weather.Properties.Periods[i])
		if err != nil {
			panic(err)
		}

		hours = append(hours, &hour)
	}
	return
}

type HourData struct {
	Units       string
	Timezone    string
	Location    string
	Start       time.Time
	End         time.Time
	Daytime     bool
	Temp        int
	Wind        int
	Weather     string
	WeatherCode int
}

func PeriodToHourData(d WeatherPeriod) (h HourData, err error) {
	// HELPFUL: https://dzhg.dev/posts/2020/08/how-to-parse-string-as-time-in-go/
	layout := "2006-01-02T15:04:05-07:00"
	start, errS := time.Parse(layout, d.StartTime)
	end, errE := time.Parse(layout, d.EndTime)
	if errS != nil || errE != nil {
		return h, errors.New("date parsing failed")
	}

	zone, _ := start.Zone()
	// fmt.Println("ZONE", zone, start)

	wind, err := strconv.Atoi(strings.Split(d.WindSpeed, " ")[0])
	if err != nil {
		// Couldn't get wind
		fmt.Println("Error parsing wind", d.WindSpeed, err)
	}

	// TODO: Does the timezone come back based on location or requester?
	h = HourData{
		Timezone:    zone,
		Start:       start,
		End:         end,
		Daytime:     d.IsDaytime,
		Temp:        d.Temperature,
		Wind:        wind,
		Weather:     strings.ToLower(d.WeatherStr),
		WeatherCode: cloudCover(strings.ToLower(d.WeatherStr)),
	}
	return
}

var WeatherMap = map[int]string{
	0: "clear",
	1: "mostly clear",
	2: "partly clear",
	3: "partly cloudy",
	4: "mostly cloudy",
	5: "cloudy",
	6: "fog",
	7: "rain",
	8: "storm",
}

// TODO: Change return value to int (map)
func cloudCover(fromApi string) (cloudcover int) {
	if strings.Contains(fromApi, "thunderstorm") {
		return 8
	}
	if strings.Contains(fromApi, "showers") || strings.Contains(fromApi, "rain") { // chance showers and thunderstorms
		return 7
	}
	if strings.Contains(fromApi, "fog") {
		return 6
	}
	switch fromApi {
	case "sunny", "clear":
		return 0
	case "mostly sunny", "mostly clear":
		return 1
	case "partly sunny", "partly clear":
		return 2
	case "partly cloudy":
		return 3
	case "mostly cloudy":
		return 4
	case "cloudy":
		return 5
	default:
		fmt.Printf("\nUnrecognized weather string value |%s|\n", fromApi)
		return -1
	}
}
