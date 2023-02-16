package forecast

import "time"


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