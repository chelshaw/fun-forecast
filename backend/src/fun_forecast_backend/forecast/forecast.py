import math
import statistics
from typing import List

from fun_forecast_backend.activity_schema.dataclasses import ActivitySchema
from fun_forecast_backend.core.standard_logger import get_logger
from fun_forecast_backend.forecast.dataclasses import Forecast
from fun_forecast_backend.shared.dataclasses import HourData, WeatherCondition


logger = get_logger()


def calculate_forecast(schema: ActivitySchema, hours: List[HourData]) -> Forecast:
    evaluated_hours: List[HourData] = []
    for hour in hours:
        hour.score = evaluate_hour_v0(schema, hour)
        evaluated_hours.append(hour)

    return Forecast(
        verb=schema.verb,
        evaluated_hours=evaluated_hours
    )


def evaluate_hour_v0(schema: ActivitySchema, hour: HourData) -> float:
    if not is_weather_acceptable(schema, hour.weatherCode):
        return -1.0

    if not is_temperature_acceptable(schema, hour.temp):
        return -1.0

    if not is_light_condition_acceptable(schema, hour.isDaytime):
        return -1.0

    return calculate_aggregate_score(schema, hour)


def is_weather_acceptable(schema: ActivitySchema, weather_condition: WeatherCondition) -> bool:
    weather_condition = weather_condition.name.lower()
    unacceptable_weather_conditions = [x.lower() for x in schema.weather_conditions.never]
    if weather_condition not in unacceptable_weather_conditions:
        logger.debug(f'Weather condition is acceptable: \'{weather_condition}\' not in {unacceptable_weather_conditions}')
        return True
    return False


def is_temperature_acceptable(schema: ActivitySchema, temp: int) -> bool:
    if int(schema.temp.max) > temp > int(schema.temp.min):
        logger.debug(f'Temperature is acceptable: {temp}, min: {schema.temp.min}, max: {schema.temp.max}')
        return True
    return False


def is_light_condition_acceptable(schema: ActivitySchema, is_daytime: bool) -> bool:
    if is_daytime and schema.light_conditions.daytime:
        logger.debug(f'Light condition is acceptable - is daytime: {is_daytime}, daytime acceptable: {schema.light_conditions.daytime}')
        return True
    if not is_daytime and schema.light_conditions.nighttime:
        logger.debug(f'Light condition is acceptable - is daytime: {is_daytime}, nighttime acceptable: {schema.light_conditions.nighttime}')
        return True
    return False


def calculate_aggregate_score(schema: ActivitySchema, hour: HourData) -> float:
    temp_score = calculate_attribute_score(schema.temp, hour.temp)
    wind_score = calculate_attribute_score(schema.wind, hour.wind)

    agg_score = statistics.harmonic_mean([temp_score, wind_score])
    logger.debug(f'Aggregate score is {agg_score}')
    return agg_score


def calculate_attribute_score(schema_property, value: int) -> float:
    if value >= schema_property.ideal:
        range = get_range(schema_property.ideal, schema_property.max)
        offset = value - schema_property.ideal
    else:
        range = get_range(schema_property.ideal, schema_property.min)
        offset = schema_property.ideal - value
    penalty = 0.0 if range == 0 else float(offset) / float(range)
    score = 1.0 - penalty
    logger.debug(f'Score for property: {schema_property} and value {value} is {score}')
    return score


def get_range(ideal, limit):
    return max(ideal, limit) - min(ideal, limit)