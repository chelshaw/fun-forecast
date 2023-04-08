import unittest

from fun_forecast_backend.main import get_activity_forecast, search_location_by_coordinates


class TestMainApp(unittest.IsolatedAsyncioTestCase):


    async def test_get_activity_forecast_endpoint__real_input(self):
        output = await get_activity_forecast(verb="hike", lat=36.8637, long=-78.5324)


    async def test_get_location_data_by_lat_long__real_input(self):
        output = await search_location_by_coordinates(lat=36.8637, long=-78.5324)
