from datetime import datetime
from typing import List

import dacite
import requests

from weather.dataclasses import WeatherApiPoint, WeatherData, Period
from shared.dataclasses import HourData, WeatherCondition


def point_from_coords(lat: float, long: float) -> WeatherApiPoint:
    url = f"https://api.weather.gov/points/{lat},{long}"
    print(f"DEBUG Fetching point from url w/ coords: {url}")
    r = requests.get(url)
    if r.status_code != 200:
        print(f"ERROR in point_from_coords: {r.json()}")
    # TODO: add logging in case of fail
    return dacite.from_dict(data_class=WeatherApiPoint, data=r.json())


def weather_from_point(p: WeatherApiPoint) -> WeatherData:
    url = f"https://api.weather.gov/gridpoints/{p.Properties.Id}/{p.Properties.X},{p.Properties.Y}/forecast/hourly?units=us"
    print(f"DEBUG Fetching weather data from url: {url}")
    r = requests.get(url)
    if r.status_code != 200:
        print(f"ERROR in weather_from_point: {r.json()}")
    # TODO: add logging in case of fail
    return dacite.from_dict(data_class=WeatherData, data=r.json())


# Previously called forecast_for_coords
def hourdata_for_coords(lat: float, long: float) -> List[HourData]:
    point = point_from_coords(lat, long)
    weather = weather_from_point(point)
    hours: List[HourData] = []
    for period in weather.Properties.Periods:
        hour = period_to_hour_data(period)
        hours = hours.append(hour)
    return hours


def period_to_hour_data(d: Period) -> HourData:
    # // HELPFUL: https: // www.digitalocean.com/community/tutorials/python-string-to-datetime-strptime
    # datetime.strptime("Tue May 08 15:14:45 +0800 2012","%a %b %d %H:%M:%S %z %Y")
    # layout = "2006-01-02T15:04:05-07:00" "01/02"
    layout = "%Y-%m-%dT%H:%M:%S%z"

    # TODO Add try/except here
    start = datetime.strptime(d.StartTime, layout)
    end = datetime.strptime(d.EndTime, layout)

    zone = start.Zone()

    # TODO Add try/except here
    wind = d.WindSpeed.split(" ")

    # TODO: Does the timezone come back based on location or requester?
    h = HourData(
        unit="F",
        timezone=zone,
        start=start,
        end=end,
        daytime=d.IsDaytime,
        temp=d.Temperature,
        wind=wind,
        weather=d.WeatherStr.lower(),
        weatherCode=cloud_cover(d.WeatherStr.lower()),
    )
    return h


def cloud_cover(fromApi: str) -> WeatherCondition:

    if "thunderstorm" in fromApi:
        return WeatherCondition.STORM

    if "showers" in fromApi or "rain" in fromApi:
        return WeatherCondition.RAIN

    if "fog" in fromApi:
        return WeatherCondition.FOG

    if fromApi == "sunny" or fromApi == "clear":
        return WeatherCondition.CLEAR

    if fromApi == "mostly sunny" or fromApi == "mostly clear":
        return WeatherCondition.MOSTLY_CLEAR

    if fromApi == "partly sunny" or fromApi == "partly clear":
        return WeatherCondition.PARTLY_CLEAR

    if fromApi == "partly cloudy":
        return WeatherCondition.PARTLY_CLOUDY

    if fromApi == "mostly cloudy":
        return WeatherCondition.MOSTLY_CLOUDY

    if fromApi == "cloudy":
        return WeatherCondition.CLOUDY

    else:
        print(f"Unrecognized weather string value |{fromApi}|", fromApi)
        return WeatherCondition.UNKNOWN
