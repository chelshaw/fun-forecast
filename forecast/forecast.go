package forecast

import (
	"chelshaw/funforecast/activity"
	"chelshaw/funforecast/weather"
	"fmt"
	"time"
)

type ForecastOutput struct {
	Type     string
	Forecast []*ForecastHour
}
type ForecastHour struct {
	Start  time.Time
	End    time.Time
	Day    int // groups results into days
	Good   bool
	Reason string
}

/** Helper func */
func contains(elems []string, v string) bool {
	for _, s := range elems {
		if v == s {
			return true
		}
	}
	return false
}

func HasNeverWeather(a *activity.ActivitySchema, h *weather.HourData) (r string) {
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

func GetMatchingRangeIndex(rs []activity.Range, currentTemp int) (idx int) {
	for id, activityRange := range rs {
		if currentTemp >= activityRange.Low && currentTemp <= activityRange.High {
			return id
		}
	}
	return -1
}

// Evaluate Hour takes an activity schema and
// evaluates it against a given hour's data
func EvaluateHour(a *activity.ActivitySchema, h *weather.HourData) (r *ForecastHour) {
	r = &ForecastHour{
		Start:  h.Start,
		End:    h.End,
		Day:    h.Start.Year() + h.Start.YearDay(),
		Good:   false,
		Reason: "Unknown",
	}

	neverReason := HasNeverWeather(a, h)
	if neverReason != "" {
		r.Reason = neverReason
		return
	}

	matchingRangeIdx := GetMatchingRangeIndex(a.Ranges, h.Temp)
	if matchingRangeIdx < 0 {
		// Shouldn't ever get here because if there isn't a temp
		// range that matches it should be caught above
		fmt.Printf("\n %v DEBUG: ranges %v || temp %v  \n", r.Day, a.Ranges, h.Temp)
		r.Reason = fmt.Sprintf("Not great, it's %s", h.Weather)
		return
	}
	matchingRange := a.Ranges[matchingRangeIdx]
	if contains(matchingRange.WithWeather, h.Weather) {
		r.Good = true
		r.Reason = fmt.Sprintf("%s and %v°F", h.Weather, h.Temp)
	} else {
		fmt.Printf("\n Reason not to: %s and %v°F", h.Weather, h.Temp)
		r.Reason = fmt.Sprintf("%s and %v°F", h.Weather, h.Temp)
	}

	return r
}

// determinGoodHour takes an activity schema and an hour,
// and determines whether it is good for the activity or not
// DEPRECATED in favor of EvaluateHour
func determineGoodHour(a *activity.ActivitySchema, h *weather.HourData) bool {
	result := false
	if h.Temp > a.TempNeverAbove || h.Temp < a.TempNeverBelow {
		return false
	}
	if h.Wind > a.WindNeverAbove || h.Wind < a.WindNeverBelow {
		return false
	}
	if a.DaytimeOnly && !h.Daytime {
		return false
	}
	for i := 0; i < len(a.WeatherNever); i++ {
		if h.Weather == a.WeatherNever[i] {
			return false
		}
	}
	// var yesWeather []string;
	for i := 0; i < len(a.Ranges); i++ {
		if h.Temp > a.Ranges[i].Low && h.Temp < a.Ranges[i].High {

			for j := 0; j < len(a.Ranges[i].WithWeather); j++ {
				if h.Weather == a.Ranges[i].WithWeather[j] {
					result = true
				} else {
					fmt.Println("matching range mismatched weather", h.Weather, a.Ranges[i].WithWeather[j])
				}
			}
		}
	}
	// fmt.Println("RESULT", result)
	return result
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
		Type:     activity.Type,
		Forecast: finalHours,
	}

	// for each hour, check if good weather for activity
	// if good, check duration == 1 and add to final output
	// otherwise hold in run (temp array)
	// if bad, check length of run and apply if >= duration
	for i := 0; i < len(weather); i++ {
		// fmt.Println("--------------")
		// fmt.Println("Start ", hours[i].Start.Format("01/02 15"), hours[i].Temp, "F", hours[i].Wind, "MPH")
		good := EvaluateHour(activity, weather[i])
		// fmt.Printf("  DETERMINED: %v", good)
		finalHours = append(finalHours, good)
	}
	forecast.Forecast = finalHours
	return
}

func GetExampleActivityForecast() (forecast *ForecastOutput, err error) {
	activity, err := activity.GetExampleActivity()
	hours, err := weather.ForecastForCoords("36.86366872201312", "-78.53235258773725")
	if err != nil {
		panic(err)
	}

	finalHours := []*ForecastHour{}
	forecast = &ForecastOutput{
		Type:     activity.Type,
		Forecast: finalHours,
	}

	// for each hour, check if good weather for activity
	// if good, check duration == 1 and add to final output
	// otherwise hold in run (temp array)
	// if bad, check length of run and apply if >= duration
	for i := 0; i < len(hours); i++ {
		// fmt.Println("--------------")
		// fmt.Println("Start ", hours[i].Start.Format("01/02 15"), hours[i].Temp, "F", hours[i].Wind, "MPH")
		good := EvaluateHour(activity, hours[i])
		// fmt.Printf("  DETERMINED: %v", good)
		finalHours = append(finalHours, good)
	}
	forecast.Forecast = finalHours
	return
}
