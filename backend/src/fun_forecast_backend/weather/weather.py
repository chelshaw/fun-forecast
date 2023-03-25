from datetime import datetime
from typing import List

import requests
from requests import Response

import dacite

from fun_forecast_backend.core.standard_logger import get_logger
from fun_forecast_backend.shared.dataclasses import WeatherCondition, HourData
from fun_forecast_backend.weather.dataclasses import WeatherApiPoint, WeatherData, Period

logger = get_logger()


def hourly_forecast_for_coords(lat: float, long: float) -> List[HourData]:
    point = point_from_coords(lat, long)
    weather = weather_from_point(point)
    hours: List[HourData] = []
    for period in weather.properties.periods:
        hour = period_to_hour_data(period)
        hours.append(hour)
    return hours

def point_from_coords(lat: float, long: float) -> WeatherApiPoint:
    url = f"https://api.weather.gov/points/{lat},{long}"
    logger.debug(f"Fetching data from: {url}")

    r: Response = requests.get(url)
    if r.status_code != 200:
        logger.error(f"Error in point_from_coords request, status code {r.status_code}")

    return dacite.from_dict(WeatherApiPoint, r.json())


def weather_from_point(p: WeatherApiPoint) -> WeatherData:
    url = f"https://api.weather.gov/gridpoints/{p.Properties.Id}/{p.Properties.X},{p.Properties.Y}/forecast/hourly?units=us"
    logger.debug(f"Fetching data from: {url}")

    r: Response = requests.get(url)
    if r.status_code != 200:
        logger.error(f"Error in weather_from_point request, status code {r.status_code}")

    return dacite.from_dict(WeatherData, r.json())


def period_to_hour_data(d: Period) -> HourData:
    # // HELPFUL: https: // www.digitalocean.com/community/tutorials/python-string-to-datetime-strptime
    # datetime.strptime("Tue May 08 15:14:45 +0800 2012","%a %b %d %H:%M:%S %z %Y")
    # layout = "2006-01-02T15:04:05-07:00" "01/02"
    layout = "%Y-%m-%dT%H:%M:%S%z"

    # TODO Add try/except here
    start = datetime.strptime(d.startTime, layout)
    end = datetime.strptime(d.endTime, layout)

    # TODO figure out how to make this work
    zone = start.zone()

    # TODO: Does the timezone come back based on location or requester?
    h = HourData(
        unit="F",
        timezone=zone,
        start=start,
        end=end,
        daytime=d.isDaytime,
        temp=d.temperature,
        wind=d.windSpeed.split(" "),
        weatherStr=d.weatherStr.lower(),
        weatherCode=assign_weather_code(d.weatherStr.lower()),
    )
    return h


def assign_weather_code(weather_string: str) -> WeatherCondition:

    if "thunderstorm" in weather_string:
        return WeatherCondition.STORM

    if "showers" in weather_string or "rain" in weather_string:
        return WeatherCondition.RAIN

    if "fog" in weather_string:
        return WeatherCondition.FOG

    if weather_string == "sunny" or weather_string == "clear":
        return WeatherCondition.CLEAR

    if weather_string == "mostly sunny" or weather_string == "mostly clear":
        return WeatherCondition.MOSTLY_CLEAR

    if weather_string == "partly sunny" or weather_string == "partly clear":
        return WeatherCondition.PARTLY_CLEAR

    if weather_string == "partly cloudy":
        return WeatherCondition.PARTLY_CLOUDY

    if weather_string == "mostly cloudy":
        return WeatherCondition.MOSTLY_CLOUDY

    if weather_string == "cloudy":
        return WeatherCondition.CLOUDY

    else:
        logger.warning(f"Unrecognized weather string value |{weather_string}|")
        return WeatherCondition.UNKNOWN
