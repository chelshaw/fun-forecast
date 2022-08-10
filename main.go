package main

import (
	"chelshaw/funforecast/activity"
	"chelshaw/funforecast/forecast"
	"fmt"
	"html/template"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Template struct {
    templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func Hello(c echo.Context) error {
	return c.Render(http.StatusOK, "hello", "World")
}

func startServer() {
	e := echo.New()
	activity.GetExampleActivity()
	t := &Template{
		templates: template.Must(template.ParseGlob("public/templates/*.html")),
	}
	e.Renderer = t
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.GET("/activity", func(c echo.Context) error {
		fmt.Println("Activity!")
		a, err := forecast.GetActivityForecast("78133", "MOTORCYCLE")
		if err != nil {
			panic(err.Error())
		}
		
		return c.JSON(http.StatusOK, &a)
	})
	e.GET("/hello", Hello)
	e.File("/world", "public/index.html")
	e.Logger.Fatal(e.Start("localhost:1323"))
}

func getLatLngFromZipcode(zipcode string) (lat string, lng string, err error) {
	lat = "29.8507"
	lng = "-98.212"
	return
}
func runExampleForecast(zipcode string) {
	output, err := forecast.GetActivityForecast(zipcode, "MOTORCYCLE")
	if err != nil {
		panic(err)
	}
	fmt.Print(output)
}

func main() {
	fmt.Println("Hi")
	// runExampleForecast("78133")
	startServer()
}
