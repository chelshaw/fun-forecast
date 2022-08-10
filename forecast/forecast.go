package forecast

import (
	"chelshaw/funforecast/activity"
	"chelshaw/funforecast/weather"
	"fmt"
	"time"
)

type ForecastOutput struct {
	Type string
	Forecast []*ForecastHour
}
type ForecastHour struct {
	Start time.Time
	End time.Time
	Day int // groups results into days
	Good bool
	Reason string
}

// Evaluate Hour takes an activity schema and 
// evaluates it against a given hour's data
func EvaluateHour(a *activity.ActivitySchema, h *weather.HourData) (r *ForecastHour) {
	r = &ForecastHour{
		Start: h.Start,
		End: h.End,
		Day: h.Start.Year() + h.Start.YearDay(),
	}
	if h.Temp > a.TempNeverAbove {
		r.Good = false
		r.Reason = "too hot"
	} else if h.Temp < a.TempNeverBelow {
		r.Good = false
		r.Reason = "too cold"
	} else if h.Wind > a.WindNeverAbove {
		r.Good = false
		r.Reason = "too windy"
	} else if h.Wind < a.WindNeverBelow {
		r.Good = false
		r.Reason = "not windy enough"
	} else if a.DaytimeOnly && !h.Daytime {
		r.Good = false
		r.Reason = "too dark"
	}
	for i := 0; i < len(a.WeatherNever); i++ {
		if h.Weather == a.WeatherNever[i] {
			r.Good = false
			r.Reason = fmt.Sprintf("weather is %s", h.Weather)
		}
	}
	// var yesWeather []string;
	for i := 0; i < len(a.Ranges); i++ {
		if h.Temp > a.Ranges[i].Low && h.Temp < a.Ranges[i].High {
			// fmt.Println("Found matching range for", a.Type)
			// fmt.Printf("\nLow %v°F, High %v°F", a.Ranges[i].Low, a.Ranges[i].High)
			// fmt.Println("Requires ", a.Ranges[i].WithWeather, " Has", h.Weather)
			
			for j := 0; j < len(a.Ranges[i].WithWeather); j++ {
				if h.Weather == a.Ranges[i].WithWeather[j] {
					r.Good = true
					r.Reason = "A great day to be outside"
				}
			}
		}
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
			// fmt.Println("Found matching range for", a.Type)
			// fmt.Printf("\nLow %v°F, High %v°F", a.Ranges[i].Low, a.Ranges[i].High)
			// fmt.Println("Requires ", a.Ranges[i].WithWeather, " Has", h.Weather)
			
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
	
	finalHours := []*ForecastHour{}
	forecast = &ForecastOutput{
		Type: activity.Type,
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
		Type: activity.Type,
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

