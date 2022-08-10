package activity

type ActivitySchema struct {
	Type           string   `json:"type"`
	TempUnit       string   `json:"temp_unit"`
	Duration       int   	`json:"duration"`
	TempNeverBelow int      `json:"temp_never_below"`
	TempNeverAbove int      `json:"temp_never_above"`
	WindNeverBelow int      `json:"wind_never_below"`
	WindNeverAbove int      `json:"wind_never_above"`
	WeatherNever   []string `json:"weather_never"`
	DaytimeOnly		bool	`json:"daytime_only"`
	Ranges         []struct {
		Low         int      `json:"low"`
		High        int      `json:"high"`
		WithWeather []string `json:"with_weather"`
	} `json:"ranges"`
}
