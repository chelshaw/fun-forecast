import os
from typing import Dict, Any

from fastapi import FastAPI

from fun_forecast_backend.activity_schema.dataclasses import ActivitySchema
from fun_forecast_backend.activity_schema.activity import get_activity_schema_by_key

app = FastAPI(title="Fun Forecast Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# logger = get_logger()


@app.on_event("startup")
async def startup():
    # await init_app_state(app.state)
    pass


@app.get("/")
async def health_check():
    return "I'm healthy, yo!"


@app.get("/api/v0/go/{verb}/{lat},{long}")
async def get_activity_forecast(verb: str, lat: float, long: float, when: str = 'today') -> Dict[str, Any]:
    try:
        # make sure params are valid, calculate date for hours response

        # fetch activity schema
        schema: ActivitySchema = get_activity_schema_by_key(verb)

        # get weather forecast for coordinates

        # sunrise/sunset forecast (times)
        # compare each hour to forecast activity
        # return answer
    except:
        return {}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=os.getenv("PORT", 5000))
