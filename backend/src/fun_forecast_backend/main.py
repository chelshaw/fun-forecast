from typing import Any, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fun_forecast_backend.activity_schema.activity import get_activity_schema_by_key
from fun_forecast_backend.activity_schema.dataclasses import ActivitySchema
from fun_forecast_backend.core.standard_logger import get_logger

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


@app.get("/api/v0/location-search/{search}")
async def get_location_suggestions(search: str) -> Dict[str, Any]:
    return {}


@app.get("/api/v0/go/{verb}/{lat},{long}")
async def get_activity_forecast(verb: str, lat: float, long: float) -> Dict[str, Any]:
    logger.debug(f"get_activity_forecast called, inputs verb={verb}, lat={lat}, long={long}")
    try:
        # fetch activity schema
        schema: ActivitySchema = get_activity_schema_by_key(verb)

        # get weather forecast for coordinates

        # sunrise/sunset forecast (times)
        # compare each hour to forecast activity
        # return answer
        return {}
    except:
        logger.error(f"get_activity_forecast failed, inputs verb={verb}, lat={lat}, long={long}")
        return {}