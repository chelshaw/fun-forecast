import requests
from requests import Response

import dacite

from .dataclasses import WeatherApiPoint, WeatherData


def point_from_coords(lat: float, long: float) -> WeatherApiPoint:
    url = f"https://api.weather.gov/points/{lat},{long}"
    print(f"FETCHING DATA FROM: {url}")

    r: Response = requests.get(url)
    if r.status_code != 200:
        print("ERROR in point_from_coords - {r.status_code}")

    return dacite.from_dict(WeatherApiPoint, r.json())


def weather_from_point(p: WeatherApiPoint) -> WeatherData:
    url = f"https://api.weather.gov/gridpoints/{p.Properties.Id}/{p.Properties.X},{p.Properties.Y}/forecast/hourly?units=us"
    print(f"FETCHING DATA FROM: {url}")

    r: Response = requests.get(url)
    if r.status_code != 200:
        print("ERROR in point_from_coords - {r.status_code}")

    return dacite.from_dict(WeatherData, r.json())
