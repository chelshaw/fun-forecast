package forecast

import (
	"chelshaw/funforecast/activity"
	"chelshaw/funforecast/weather"
	"fmt"
	"time"
)

type ForecastOutput struct {
	Verb     string				`json:"verb"`
	LocationKey string			`json:"location_key"`
	LocationName string			`json:"location_name"`
	Forecast []*ForecastHour	`json:"forecast"`
}
type ForecastHour struct {
	Start    time.Time	`json:"start"`
	End      time.Time	`json:"end"`
	Day      int 	`json:"day"`
	Good     bool	`json:"good"`
	Reason   string	`json:"reason"`
	Overview string	`json:"overview"`
}

/** Helper func */
// func contains(elems []string, v string) bool {
// 	for _, s := range elems {
// 		if v == s {
// 			return true
// 		}
// 	}
// 	return false
// }

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
		reason = "too clear"
	case 3, 4, 5:
		reason = "too cloudy"
	case 6:
		reason = "too foggy"
	case 7:
		reason = "too rainy"
	default:
		reason = "too stormy"
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

// GetActivityForecast takes a zipcode and an activity key, and
// returns
func GetActivityForecast(zipcode string, activityKey string) (forecast *ForecastOutput, err error) {
	activity, err := activity.GetActivityByKey(activityKey)
	if err != nil {
		return
	}
	// lat, lng, err := getLatLngForZipcode
	weather, err := weather.ForecastForCoords("36.86366872201312", "-78.53235258773725")
	if err != nil {
		return
	}
	finalHours := []*ForecastHour{}
	forecast = &ForecastOutput{
		Verb:     activity.Type,
		LocationKey: "78666",
		LocationName: "San Marcos, TX",
		Forecast: finalHours,
	}

	// for each hour, check if good weather for activity
	// if good, check duration == 1 and add to final output
	// otherwise hold in run (temp array)
	// if bad, check length of run and apply if >= duration
	for i := 0; i < len(weather); i++ {
		good := EvaluateHour(activity, weather[i])
		finalHours = append(finalHours, good)
	}
	forecast.Forecast = finalHours
	return
}
