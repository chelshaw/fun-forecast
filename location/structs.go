package location

type ZipcodeLocation struct {
	Properties struct{
		Id string `json:"gridId"`
		X  int    `json:"gridX"`
		Y  int    `json:"gridY"`
		RelativeLocation struct {
			Properties struct {
				City string `json:"city"`
				State string `json:"state"`
			} `json:"properties"`
		} `json:"relativeLocation"`
		Timezone string `json:"timeZone"`
	} `json:"properties"`
}