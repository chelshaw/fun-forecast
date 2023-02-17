package main

import (
	"chelshaw/funforecast/forecast"
	"chelshaw/funforecast/location"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/coocood/freecache"
	cache "github.com/gitsight/go-echo-cache"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func splitActivityRef(param string)(verb string, locationRef string, err error) {
	keys := strings.Split(param, "_")
	verb = keys[0]
	locationRef = keys[1]
	return
}

// evolved from https://gobyexample.com/worker-pools
// TODO: How to return schema struct not string
func exampleWorker(id int, jobs <-chan string, results chan<- string) {
    for j := range jobs {
        fmt.Println("worker", id, "started  job", j)
        time.Sleep(time.Second)
        fmt.Println("worker", id, "finished job", j)
        results <- fmt.Sprintf("job done: %s", j)
    }
}
func example() { // get forecast per verb
    const numJobs = 3 // must match verbs.len
	verbs := [3]string{"hike", "motorcycle", "run"}
    jobs := make(chan string, numJobs)
    results := make(chan string, numJobs)

    for w := 1; w <= 3; w++ {
        go exampleWorker(w, jobs, results)
    }

    for j := 0; j < numJobs; j++ {
        jobs <- verbs[j]
    }
    close(jobs)

    for a := 1; a <= numJobs; a++ {
        <-results
    }
}

func myActivityHandler(ctx echo.Context) error {
	key := ctx.Param("activity_ref")
	verb, locationRef, err := splitActivityRef(key)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, err.Error())
	}
	activityKey := strings.ToUpper(verb)
	lat, lng, err := location.GetCoordsFromLocRef(locationRef)
	if err != nil {
		fmt.Println(err)
		return ctx.JSON(http.StatusNotFound, err.Error())
		// return ctx.String(http.StatusBadRequest, fmt.Sprintf("Could not get activity forecast: %e", err))
	}
	output, err := forecast.GetActivityForecast(activityKey, lat, lng)
	if err != nil {
		fmt.Println(err)
		return ctx.JSON(http.StatusNotFound, err.Error())
		// return ctx.String(http.StatusBadRequest, fmt.Sprintf("Could not get activity forecast: %e", err))
	}
	return ctx.JSON(http.StatusOK, &output)
}

func zipcodeInfoHandler(ctx echo.Context) error {
	zipcode := ctx.Param("zipcode")
	url, err := location.FetchLocationByZipcode(zipcode)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, err.Error())
	}
	
	return ctx.String(http.StatusOK, fmt.Sprintf("url: %s", url))
}

func startServer() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	c := freecache.NewCache(1024 * 1024 * 1000) // Pre-allocated cache of 100Mb)

	e := echo.New()
	ttl, err := time.ParseDuration("1h")
	if err != nil {
		panic(err)
	}
	e.Use(cache.New(&cache.Config{ TTL: ttl }, c))
	// e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:4200"},
		AllowMethods: []string{http.MethodGet, http.MethodPut},
	}))
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "This is your fun forecast. Hint: go to /api/v0/me/hike_78666")
	})
	e.GET("/api/v0/zipcode/:zipcode", zipcodeInfoHandler)
	e.GET("/api/v0/me/:activity_ref", myActivityHandler)

	e.Logger.Fatal(e.Start("localhost:1323"))
}


func main() {
	fmt.Println("Hey cutie ;)")
	startServer()
	example()
}
