import unittest

from fun_forecast_backend.main import get_activity_forecast


class TestMainApp(unittest.IsolatedAsyncioTestCase):


    async def test_get_activity_forecast_endpoint__real_input(self):
        output = await get_activity_forecast(verb="hike", lat=36.8637, long=-78.5324)
        # self.assertTrue(isinstance(crawler, SERPApiClient))