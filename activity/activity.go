package activity

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
)

var ActivityMap = map[string]string{
	"MOTORCYCLE": "./activity-schemas/motorbike.json",
	// "KAYAK": "./activity-schemas/kayak.json",
	// "RUN": "./activity-schemas/run.json",
	// "HORSE": "./activity-schemas/run.json",
}

func GetActivityByKey(t string) (payload *ActivitySchema, err error) {
	activityFile, ok := ActivityMap[t]
	if !ok {
		// TODO: return error
		// panic(errors.New("Not found in map"))
		return nil, errors.New("Activity does not have a schema")
	}
	fmt.Println("Found activity file", activityFile)
	content, err := ioutil.ReadFile(activityFile)
    if err != nil {
        return nil, errors.New("Activity schema not found")
    }
 
    // Now let's unmarshall the data into `payload`
    // var payload ActivitySchema
    err = json.Unmarshal(content, &payload)
    if err != nil {
        fmt.Println("Error during Unmarshal(): ", err)
		// panic(err.Error())
    }

    // Let's print the unmarshalled data!
    log.Printf("type: %s\n", payload.Type)
	return 
}

func exampleActivity() []byte {
	// TODO: blocklist or allowlist weather enums?
	// Duration is hourly, minimum 1
	motoData := []byte(`{
		"type": "motorcycle",
		"duration": 1,
		"temp_unit": "F",
		"temp_never_below": 60,
		"temp_never_above": 97,
		"weather_never": ["sleet", "rain", "lightning"],
		"wind_never_above": 18,
		"wind_never_below": 0,
		"daytime_only": true,
		"ranges": [
			{ "high": 78, "low": 60, "with_weather": ["sunny", "partly sunny"] },
			{ "high": 97, "low": 78, "with_weather": ["partly cloudy", "cloudy"] }
		]
	}`)
	return motoData
}

func activityFromJson(data []byte) (a *ActivitySchema, err error) {
	var activity ActivitySchema
	err = json.Unmarshal(data, &activity)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return &activity, err
}

func GetExampleActivity() (a *ActivitySchema, err error) {
	// data := exampleActivity()
	a, err = GetActivityByKey("MOTORCYCLE")
	// a, err = activityFromJson(data)
	return
}
