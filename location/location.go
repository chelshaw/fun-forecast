package location

import (
	"fmt"
	"net/http"
	"os"
)

func FetchLocationByZipcode(zipcode string) (url string, err error) {
	apiKey := os.Getenv("ZIPCODEAPI_KEY")
	url = fmt.Sprintf("https://www.zipcodeapi.com/rest/%s/info.json/%s/degrees", apiKey, zipcode)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("ERROR fetching location by zipcode: %v", err.Error())
	}
	defer resp.Body.Close()
	fmt.Print(resp.Body)
	return
}

func GetCoordsFromLocRef(zipcode string) (lat float32, lng float32, err error) {
	// TODO: remove hardcoded values
	lat = 36.86366872201312;
	lng = -78.53235258773725;
	return;
}


func getLocFromAddress(zipcode string) (err error) {
	// DOCS: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
	// TODO: how to url-encode the input?
	url := fmt.Sprintf("https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=%sformat=json&benchmark=4", zipcode)
	resp, err := http.Get(url)
	fmt.Printf("%v", resp)
	if err != nil {
		fmt.Println("\n\nERROR getpointFromCoords!")
		return
	}
	return
	// defer resp.Body.Close()
}