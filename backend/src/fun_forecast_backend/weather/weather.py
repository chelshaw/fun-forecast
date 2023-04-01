from datetime import datetime
from typing import List

import requests
from requests import Response
from decimal import Decimal

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


def convert_to_point_coord(coord:float) -> str:
    precise = Decimal(coord).quantize(Decimal('.0001'))
    logger.debug(f"converted coord {coord} to precise {precise}")
    return str(precise)


def point_from_coords(lat: float, long: float) -> WeatherApiPoint:
    preciseLat = convert_to_point_coord(lat)
    preciseLong = convert_to_point_coord(long)
    url = f"https://api.weather.gov/points/{preciseLat},{preciseLong}"
    logger.debug(f"Fetching data from: {url}")

    r: Response = requests.get(url)
    if r.status_code != 200:
        logger.error(f"Error in point_from_coords request, status code {r.status_code}")

    try:
        point = dacite.from_dict(WeatherApiPoint, r.json())
    except Exception as e:
        logger.error(e)
        raise e

    return point


def weather_from_point(p: WeatherApiPoint) -> WeatherData:
    url = f"https://api.weather.gov/gridpoints/{p.properties.gridId}/{p.properties.gridX},{p.properties.gridY}/forecast/hourly?units=us"
    logger.debug(f"Fetching data from: {url}")

    r: Response = requests.get(url)
    if r.status_code != 200:
        logger.error(f"Error in weather_from_point request, status code {r.status_code}")

    print(r.json())
    try:
        weather_data = dacite.from_dict(WeatherData, r.json())
    except Exception as e:
        logger.error(e)
        raise e

    return weather_data


def period_to_hour_data(d: Period) -> HourData:
    # // HELPFUL: https: // www.digitalocean.com/community/tutorials/python-string-to-datetime-strptime
    # datetime.strptime("Tue May 08 15:14:45 +0800 2012","%a %b %d %H:%M:%S %z %Y")
    # layout = "2006-01-02T15:04:05-07:00" "01/02"
    layout = "%Y-%m-%dT%H:%M:%S%z"
    start = datetime.strptime(d.startTime, layout)
    end = datetime.strptime(d.endTime, layout)

    # TODO: Does the timezone come back based on location or requester?
    try:
        h = HourData(
            temp=d.temperature,
            wind=int(d.windSpeed.split(" ")[0]),
            timezone=start.tzinfo,
            start=start,
            end=end,
            isDaytime=d.isDaytime,
            weatherStr=d.shortForecast.lower(),
            weatherCode=assign_weather_code(d.shortForecast.lower()),
            unit="F",
        )
    except Exception as e:
        logger.error(e)
        raise e

    return h


def assign_weather_code(weather_string: str) -> WeatherCondition:

    if "thunderstorm" in weather_string:
        return WeatherCondition.STORM

    if "showers" in weather_string or "rain" in weather_string:
        return WeatherCondition.RAIN

    if "fog" in weather_string:
        return WeatherCondition.FOG

    if "snow" in weather_string:
        return WeatherCondition.SNOW

    if "hail" in weather_string:
        return WeatherCondition.HAIL

    if "sleet" in weather_string:
        return WeatherCondition.SLEET

    if "ice" in weather_string:
        return WeatherCondition.ICE

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
