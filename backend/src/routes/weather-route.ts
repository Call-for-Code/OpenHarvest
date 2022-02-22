// import dependencies and initialize the express router
import { Router } from "express";
import { GeoCode } from "integrations/weather-company-api.types";
import { WeatherCompanyAPI } from "./../integrations/weather-company-api.service";

const router = Router();

const api = new WeatherCompanyAPI();

const testMchinjiMalawiCoords: GeoCode = {
    latitude: -13.7971726,
    longitude: 32.8874963
}

/**
 * Gets the forecast for a farmer. Right now this is hardcoded while we wait for farmer data from the session
 */
router.get("/farmerForecast", async (req, res) => {
    console.log("farmerForecast");
    const geocode = testMchinjiMalawiCoords;
    const forecast = await api.daily15DayForecast(geocode);
    // console.log(forecast);
    res.json(forecast);
});

export default router;
