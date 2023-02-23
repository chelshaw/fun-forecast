package server

import (
	"chelshaw/funforecast/forecast"
	"chelshaw/funforecast/location"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"html/template"

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

type Template struct {
    templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func Hello(c echo.Context) error {
	return c.Render(http.StatusOK, "hello", "World")
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

func newActivityHandler(ctx echo.Context) error {
	key := ctx.Param("activity_ref")
	verb, locationRef, err := splitActivityRef(key)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, err.Error())
	}
	activityKey := strings.ToUpper(verb)
	fmt.Printf("ref %v, activity %v, locRef %v", key, verb, locationRef)
	lat, lng, err := location.GetCoordsFromLocRef(locationRef)
	if err != nil {
		fmt.Println(err)
		return ctx.JSON(http.StatusNotFound, err.Error())
	}
	output, err := forecast.ScoreForecast(activityKey, lat, lng, "2023-02-23")
	if err != nil {
		fmt.Println(err)
		return ctx.JSON(http.StatusNotFound, err.Error())
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

func StartServer() {
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
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:4200"},
		AllowMethods: []string{http.MethodGet, http.MethodPut},
	}))
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "This is your fun forecast. Hint: go to /api/v0/me/motorcycle_78666")
	})
	e.GET("/api/v0/zipcode/:zipcode", zipcodeInfoHandler)
	e.GET("/api/v0/go/:activity_ref", newActivityHandler)
	e.GET("/api/v0/me/:activity_ref", myActivityHandler)

	e.Logger.Fatal(e.Start("localhost:1323"))
}

