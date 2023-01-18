package main

import (
	"chelshaw/funforecast/forecast"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/coocood/freecache"
	cache "github.com/gitsight/go-echo-cache"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func Hello(c echo.Context) error {
	return c.Render(http.StatusOK, "hello", "Chelsea")
}

func splitActivityRef(param string)(verb string, locationRef string, err error) {
	keys := strings.Split(param, "_")
	verb = keys[0]
	locationRef = keys[1]
	return
}

func startServer() {
	c := freecache.NewCache(1024 * 1024 * 1000) // Pre-allocated cache of 100Mb)

	e := echo.New()
	ttl, err := time.ParseDuration("1h")
	if err != nil {
		panic(err)
	}
	e.Use(cache.New(&cache.Config{ TTL: ttl }, c))
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	t := &Template{
		templates: template.Must(template.ParseGlob("public/templates/*.html")),
	}
	e.Renderer = t
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:4200"},
		AllowMethods: []string{http.MethodGet, http.MethodPut},
	}))
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "This is your fun forecast. Hint: go to /example")
	})
	e.GET("/api/v0/me/:activity_ref", func(ctx echo.Context) error {
		key := ctx.Param("activity_ref")
		verb, locationRef, err := splitActivityRef(key)
		if err != nil {
			panic(err)
		}
		activityKey := strings.ToUpper(verb)
		output, err := forecast.GetActivityForecast(locationRef, activityKey)
		if err != nil {
			fmt.Println(err)
			return ctx.String(http.StatusBadRequest, fmt.Sprintf("Could not get activity forecast: %e", err))
		}
		// fmt.Print(output)
		return ctx.JSON(http.StatusOK, &output)
	})
	e.GET("/example", func(c echo.Context) error {
		fmt.Println("Activity!")
		a, err := forecast.GetActivityForecast("78666", "MOTORCYCLE")
		if err != nil {
			fmt.Println("There was an error")
			panic(err.Error())
		}

		return c.JSON(http.StatusOK, &a)
	})
	e.GET("/hello", Hello)
	e.File("/world", "public/index.html")
	e.Logger.Fatal(e.Start("localhost:1323"))
}


func main() {
	fmt.Println("Hey cutie ;)")
	// runExampleForecast("78666")
	startServer()
}
