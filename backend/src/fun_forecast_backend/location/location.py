import os
import requests
from requests import Response
from fastapi import HTTPException
from typing import Dict, Any
import dacite

from fun_forecast_backend.core.standard_logger import get_logger
from .dataclasses import GeocodeResponse

logger = get_logger()

if 'MAPBOX_API_KEY' in os.environ:
    mapboxKey = os.environ['MAPBOX_API_KEY']
else:
    logger.warn('MAPBOX_API_KEY not set, location search endpoint will not work')


def get_location_suggestions(keyword: str) -> Dict[str, Any]:
    try:
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{keyword}.json?country=us&limit=5&access_token={mapboxKey}"

        r: Response = requests.get(url)
        if r.status_code != 200:
            logger.error(f"error response in geocode for {keyword} - {r.status_code}: {r.text}")
            raise HTTPException(
                status_code=404, detail="Something went wrong. Please try again later.")

        response = dacite.from_dict(GeocodeResponse, r.json())
        
        # Instead of empty response, return error
        if not response.features:
            raise HTTPException(
                status_code=400, detail="Could not find results. Please try a different keyword.")
        
        return response
    except:
        logger.error("get_location_suggestions failed for keyword {keyword}")
        raise HTTPException(
            status_code=500, detail="Something went wrong. Please try again later.")