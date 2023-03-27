from typing import List

from fun_forecast_backend.activity_schema.dataclasses import ActivitySchema
from fun_forecast_backend.forecast.dataclasses import EvaluatedHour, Forecast, LocationInfo
from fun_forecast_backend.shared.dataclasses import HourData


def calculate_forecast(schema: ActivitySchema, hours: List[HourData]):# -> Forecast:

    evaluated_hours: List[EvaluatedHour] = []

    for hour in hours:
        e = evaluate_v0(hour)
        evaluated_hours.append(e)


def evaluate_v0(hour: HourData) -> EvaluatedHour:
    print(hour)