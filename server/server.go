package server

import (
	"chelshaw/funforecast/weather"
	"fmt"
	"io"
	"net/http"

	"html/template"

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

func StartServer() {
	e := echo.New()
	t := &Template{
		templates: template.Must(template.ParseGlob("public/templates/*.html")),
	}
	e.Renderer = t
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.GET("/activity", func(c echo.Context) error {
		fmt.Println("Activity!")
		example := weather.WeatherPeriod{
			StartTime: "Example",
			EndTime: "example",
			IsDaytime: false,
			Temperature: 4,
			TemperatureUnit: "another",
			WindSpeed: "another",
			WeatherStr: "another",
		}
		return c.JSON(http.StatusOK, &example)
	})
	e.GET("/hello", Hello)
	e.File("/world", "public/index.html")
	e.Logger.Fatal(e.Start("localhost:1323"))
}

func main() {
	StartServer()
}
