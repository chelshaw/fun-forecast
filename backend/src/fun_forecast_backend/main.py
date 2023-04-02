from dataclasses import asdict
from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from fun_forecast_backend.activity_schema.activity import get_activity_schema_by_key
from fun_forecast_backend.activity_schema.dataclasses import ActivitySchema
from fun_forecast_backend.core.standard_logger import get_logger
from fun_forecast_backend.forecast.dataclasses import Forecast
from fun_forecast_backend.forecast.forecast import calculate_forecast
from fun_forecast_backend.location.location import get_location_suggestions
from fun_forecast_backend.location.dataclasses import GeocodeResponse
from fun_forecast_backend.shared.dataclasses import HourData
from fun_forecast_backend.weather.weather import hourly_forecast_for_coords

logger = get_logger()

app = FastAPI(title="Fun Forecast Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://myfunforecast.com", "http://beta.myfunforecast.com"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
    max_age=3600,
)


@app.on_event("startup")
async def startup():
    # await init_app_state(app.state)
    pass


@app.get("/")
async def health_check():
    return "I'm healthy, yo!"


@app.get("/api/v0/location-search/{keyword}")
async def search_location_by_keyword(keyword: str) -> GeocodeResponse:
    return get_location_suggestions(keyword)


@app.get("/api/v0/get-forecast/{verb}/{lat},{long}")
async def get_activity_forecast(verb: str, lat: float, long: float) -> JSONResponse:
    logger.debug(f"Processing get_activity_forecast request, inputs verb={verb}, lat={lat}, long={long}")
    try:
        # fetch activity schema
        schema: ActivitySchema = get_activity_schema_by_key(verb)

        # get weather data for coordinates
        hours: List[HourData] = hourly_forecast_for_coords(lat=lat, long=long)

        # predict activity viability
        forecast: Forecast = calculate_forecast(schema, hours)

        logger.debug(f'Successfully processed get_activity_forecast, inputs verb={verb}, lat={lat}, long={long}')
        json_compatible_item_data = jsonable_encoder(forecast)
        return JSONResponse(content=json_compatible_item_data)
    except Exception as e:
        logger.error(f"Failed get_activity_forecast, inputs verb={verb}, lat={lat}, long={long}: {e}")
        empty_return = Forecast(verb=verb)
        return asdict(empty_return)
