// import dependencies and initialize the express router
import { Request, Router } from "express";
import { isUndefined, toGroCodeFromPoint, UserDto } from "../../../common-types/src";
import { weatherCompanyService } from "../integrations/weatherCompany/WeatherCompanyService";
import { organisationService } from "../services/OrganisationService";

const router = Router();

// const testMchinjiMalawiCoords: GeoCode = {
//     latitude: -13.7971726,
//     longitude: 32.8874963
// }

/**
 * Gets the forecast for a farmer. Right now this is hardcoded while we wait for farmer data from the session
 */
router.post("/farmerForecast", async (req: Request<{}, {}, UserDto>, res) => {
    console.log("farmerForecast");

    const userDto = req.body;


    const weatherCompanyConfig = await organisationService.getWeatherCompanyConfig(userDto.organisation.name);
    if (isUndefined(weatherCompanyConfig)) {
        return res.status(400).send( "User's organisation is not configured to use weather company");
    }

    const forecast = await weatherCompanyService.daily15DayForecast(weatherCompanyConfig, toGroCodeFromPoint(userDto.location));
    // console.log(forecast);
    res.json(forecast);
});

export default router;
