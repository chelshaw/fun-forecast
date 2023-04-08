import unittest

from fun_forecast_backend.main import get_activity_forecast, search_location_by_coordinates


class TestMainApp(unittest.IsolatedAsyncioTestCase):

    # get_activity_forecast endpoint
    async def test_get_activity_forecast_endpoint__real_input(self):
        output = await get_activity_forecast(verb="hike", lat=36.8637, long=-78.5324)

    # get_location_data_by_lat_long endpoint
    async def test_get_location_data_by_lat_long__real_input(self):
        output = await search_location_by_coordinates(lat=36.8637, long=-78.5324)

    async def test_get_location_data_by_lat_long__washington_dc_edgecase(self):
        output = await search_location_by_coordinates(lat=38.9072, long=-77.0369)

    async def test_get_location_data_by_lat_long__middle_of_nowhere_edgecase(self):
        output = await search_location_by_coordinates(lat=30.3317, long=-100.6092)
