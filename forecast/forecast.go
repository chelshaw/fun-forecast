package forecast

import (
	"chelshaw/funforecast/activity"
	"chelshaw/funforecast/weather"
	"fmt"
	"log"
	"time"
)

func hasNeverWeather(a *activity.ActivitySchema, h *weather.HourData) (r string) {
	if h.Temp > a.TempNeverAbove {
		return "too hot"
	} else if h.Temp < a.TempNeverBelow {
		return "too cold"
	} else if h.Wind > a.WindNeverAbove {
		return "too windy"
	} else if h.Wind < a.WindNeverBelow {
		return "not windy enough"
	} else if a.DaytimeOnly && !h.Daytime {
		return "too dark"
	}
	return ""
}

func getMatchingRangeIndex(rs []activity.Range, currentTemp int) (idx int) {
	for id, activityRange := range rs {
		if currentTemp >= activityRange.Low && currentTemp <= activityRange.High {
			return id
		}
	}
	return -1
}

func reasonFromWeatherCode(weatherCode int) (reason string) {
	// TODO: How to codify windiness?
	switch weatherCode {
	case 0, 1, 2:
		reason = "sunny"
	case 3, 4, 5:
		reason = "cloudy"
	case 6:
		reason = "foggy"
	case 7:
		reason = "rainy"
	default:
		reason = "stormy"
	}
	return
}

func weatherCodeInRange(weatherCode int, weatherRange []int) (b bool, reason string) {
	reason = ""
	for idx, limit := range weatherRange {
		if idx == 0 && weatherCode < limit {
			return false, reasonFromWeatherCode(weatherCode)
		}
		if idx == 1 && weatherCode > limit {
			return false, reasonFromWeatherCode(weatherCode)
		}
	}
	return true, reason
}

func EvaluateHour(a *activity.ActivitySchema, h *weather.HourData) (r *ForecastHour) {
	r = &ForecastHour{
		Start:    h.Start,
		End:      h.End,
		Day:      h.Start.Year() + h.Start.YearDay(),
		Good:     false,
		Reason:   "Unknown",
		Overview: fmt.Sprintf("%s and %v°F", h.Weather, h.Temp),
	}

	neverReason := hasNeverWeather(a, h)
	if neverReason != "" {
		r.Reason = neverReason
		return
	}

	matchingRangeIdx := getMatchingRangeIndex(a.Ranges, h.Temp)
	if matchingRangeIdx < 0 {
		// Shouldn't ever get here because if there isn't a temp
		// range that matches it should be caught above
		fmt.Printf("\n %v DEBUG: ranges %v || temp %v  \n", r.Day, a.Ranges, h.Temp)
		r.Reason = fmt.Sprintf("Not ideal, it's %s and %v", h.Weather, h.Temp)
		return
	}
	matchingRange := a.Ranges[matchingRangeIdx]
	inRange, reason := weatherCodeInRange(h.WeatherCode, matchingRange.WithWeather)
	if inRange {
		r.Good = true
		r.Reason = "😎"
	} else {
		// fmt.Printf("\n NOT GOOD: Weathercode: %v Reason: %s", h.WeatherCode, reason)
		r.Reason = reason
	}

	return r
}

// GetActivityForecast takes an activity key and coordinates, and
// returns Forecast Output including location details and hours
func GetActivityForecast(activityKey string, lat float32, lng float32) (forecast *ForecastOutput, err error) {
	activitySchema, err := activity.GetActivityByKey(activityKey)
	if err != nil {
		return nil, err
	}
	// lat, lng, err := getLatLngForZipcode
	weather, err := weather.ForecastForCoords(lat, lng)
	if err != nil {
		return nil, err
	}
	finalHours := []*ForecastHour{}

	// for each hour, check if good weather for activity
	// if good, check duration == 1 and add to final output
	// otherwise hold in run (temp array)
	// if bad, check length of run and apply if >= duration
	for i := 0; i < len(weather); i++ {
		good := EvaluateHour(activitySchema, weather[i])
		finalHours = append(finalHours, good)
	}
	forecast = &ForecastOutput{
		Verb:     activitySchema.Verb,
		LocationKey: "78666",
		LocationName: "San Marcos, TX",
		Forecast: finalHours,
	}
	return
}

// V2 ScoreForecast
func conditionsForRange(weather *weather.HourData, activityRange *activity.Range) (score int, conditions []string) {
	score = 0
	conditions = make([]string, 0, 7)
	for idx, limit := range activityRange.WithWeather {
		// First in array is lower limit
		if idx == 0 && weather.WeatherCode < limit {
			conditions = append(conditions, reasonFromWeatherCode(weather.WeatherCode))
			score += 1
		}
		// second in array is upper limit
		if idx == 1 && weather.WeatherCode > limit {
			conditions = append(conditions, reasonFromWeatherCode(weather.WeatherCode))
			score += 1
		}
		// TODO: check other conditions like wind, UV, etc
	}
	return
}

const SCORE_MAX = 2

// V2 ScoreForecast
func ScoreHour(a *activity.ActivitySchema, h *weather.HourData) (HourForecast) {
	// TODO: check the units match
	var conditions = make([]string, 0, 7)
	var score = 0

	// Step 1: Check never params
	if h.Temp > a.TempNeverAbove {
		conditions = append(conditions, "hot")
		score += SCORE_MAX
	}
	if h.Temp < a.TempNeverBelow {
		conditions = append(conditions, "cold")
		score += SCORE_MAX
	}
	if h.Wind > a.WindNeverAbove {
		conditions = append(conditions, "wind")
		score += SCORE_MAX
	}
	if !h.Daytime && a.DaytimeOnly {
		conditions = append(conditions, "dark")
		score += SCORE_MAX
	}
	if score > 0 {
		return HourForecast{
			Start:    h.Start,
			End:      h.End,
			Score: 	  score,
			Conditions: conditions,
			Temperature: h.Temp,
			Unit: h.Units,
		}
	}

	// Step 2: Calculate conditions based on range
	matchingRangeIdx := getMatchingRangeIndex(a.Ranges, h.Temp)
	if matchingRangeIdx < 0 {
		// Shouldn't ever get here because if there isn't a temp
		// range that matches it should be caught above
		log.Fatalf("No matching range idx for %v when %v°%v. Check the activity schema for validity.", a.Verb, h.Temp, h.Units)
	}
	matchingRange := a.Ranges[matchingRangeIdx]
	rangeScore, rangeConditions := conditionsForRange(h, &matchingRange)
	conditions = append(conditions, rangeConditions...)
	score += rangeScore;

	return HourForecast{
		Start:    h.Start,
		End:      h.End,
		Score: 	  score,
		Conditions: conditions,
		Temperature: h.Temp,
		Unit: h.Units,
	}
}

// V2 ScoreForecast
func ScoreForecast(activityKey string, lat float32, lng float32, date string) (forecast *NewForecastOutput, err error) {
	activitySchema, err := activity.GetActivityByKey(activityKey)
	if err != nil {
		return nil, err
	}
	// lat, lng, err := getLatLngForZipcode
	weather, err := weather.ForecastForCoords(lat, lng)
	if err != nil {
		return nil, err
	}
	finalHours := []HourForecast{}
	layout := "2006-01-02"
	desiredDay, err := time.Parse(layout, date)
	// d := time.Date(2000, 2, 1, 12, 30, 0, 0, time.UTC)
	matchYear, matchMonth, matchDay := desiredDay.Date()
	for i := 0; i < len(weather); i++ {
		year, month, day := weather[i].Start.Date()
		if year == matchYear && month == matchMonth && day == matchDay {
			score := ScoreHour(activitySchema, weather[i])
			finalHours = append(finalHours, score)
		}
	}
	secondsEastOfUTC := int((-5 * time.Hour).Seconds())
	austin := time.FixedZone("Beijing Time", secondsEastOfUTC)
	location := LocationInfo{
		Ref: "78666",
		City: "San Marcos",
		State: "Texas",
		Sunrise: time.Date(2023, time.February, 6, 23, 0, 0, 0, austin),
		Sunset: time.Date(2023, time.February, 19, 03, 0, 0, 0, austin),
	}
	forecast = &NewForecastOutput{
		Verb:     activitySchema.Verb,
		Location: location,
		Forecast: finalHours,
	}
	return
}