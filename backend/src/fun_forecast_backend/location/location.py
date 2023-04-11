import os
import requests
from requests import Response

import dacite
from fastapi import HTTPException

from fun_forecast_backend.core.standard_logger import get_logger
from .dataclasses import GeocodeResponse

logger = get_logger()

mapbox_api_key: str = ''
if 'MAPBOX_API_KEY' in os.environ:
    mapbox_api_key = os.environ['MAPBOX_API_KEY']
else:
    logger.warning('MAPBOX_API_KEY env variable not set, location search endpoint will not work')


def get_location_suggestions(keyword: str) -> GeocodeResponse:
    try:
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{keyword}.json?country=us&limit=5&access_token={mapbox_api_key}"

        r: Response = requests.get(url)
        if r.status_code != 200:
            logger.error(f"Error response in geocode for {keyword} - {r.status_code}: {r.text}")
            raise HTTPException(
                status_code=404, detail="Something went wrong. Please try again later.")

        response = dacite.from_dict(GeocodeResponse, r.json())
        
        # Instead of empty response, return error
        if not response.features:
            raise HTTPException(
                status_code=400, detail="Could not find results. Please try a different keyword.")
        
        return response
    except Exception as e:
        logger.error(f"get_location_suggestions failed for keyword: {keyword} - {e}")
        raise HTTPException(
            status_code=500, detail="Something went wrong. Please try again later.")
