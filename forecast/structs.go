package forecast

import (
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

// v2 ScoreForecast
type LocationInfo struct {
    Ref    	string 	`json:"ref"`
	Sunrise	time.Time `json:"sunrise"`
	Sunset	time.Time `json:"sunset"`
	City	string	`json:"city"`
	State	string	`json:"state"`
}
type NewForecastOutput struct {
	Verb     string				`json:"verb"`
	Location LocationInfo		`json:"location"`
	Forecast []HourForecast	`json:"forecast"`
}
type HourForecast struct {
	Start    	time.Time	`json:"start"`
	End      	time.Time	`json:"end"`
	Score   	int	`json:"score"`
	Conditions	[]string	`json:"conditions"`
	Temperature int 	`json:"temperature"`
	Unit 		string	`json:"unit"`
}