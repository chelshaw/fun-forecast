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
	"HIKE": "./activity-schemas/hike.json",
	// "KAYAK": "./activity-schemas/kayak.json",
	// "RUN": "./activity-schemas/run.json",
	// "HORSE": "./activity-schemas/run.json",
}

func GetActivityByKey(t string) (activitySchema *ActivitySchema, err error) {
	activityFile, ok := ActivityMap[t]
	if !ok {
		return nil, errors.New("activity does not have a schema")
	}
	fmt.Println("Found activity file", activityFile)
	content, err := ioutil.ReadFile(activityFile)
	if err != nil {
		return nil, errors.New("activity schema not found")
	}

	// Now let's unmarshall the data into `payload`
	err = json.Unmarshal(content, &activitySchema)
	if err != nil {
		fmt.Println("Error during Unmarshal(): ", err.Error())
		// panic(err.Error())
		return
	}

	// Let's print the unmarshalled data!
	log.Printf("verb: %s\n", activitySchema.Verb)
	return
}
