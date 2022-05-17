import axios from "axios";
import { CommonOptions, DataFormat, GeoCodeNumber, geoCodeToString, Language, Unit, WeatherCompanyConfig } from "../../../../common-types/src";

const apiRequestLimit = 50; // It's really 100 per minute
let apiRequestCounter = 0;

class WeatherCompanyService {

    defaultOptions: CommonOptions;

    // baseAPI = "https://api.weather.com/"

    constructor() {
        this.defaultOptions = {
            format: DataFormat.JSON,
            language: Language.English,
            units: Unit.metric
        }

        // setup API throttler, every minute it resets the apiRequestLimit
        setInterval(() => {
            apiRequestCounter = 0;
        }, 1000 * 60);
    }

    apiHitCounter() {
        if (apiRequestCounter >= apiRequestLimit) {
            throw new Error("Too many Requests");
        }
        else {
            apiRequestCounter++;
        }
    }

    async daily15DayForecast(config: WeatherCompanyConfig, geocode: GeoCodeNumber) {
        const commonOptions = config.options || this.defaultOptions;
        const paramOptions = {
            geocode: geoCodeToString(geocode),
            apiKey: config.apiKey
        }
        const queryOptions = Object.assign({}, commonOptions, paramOptions);

        this.apiHitCounter()

        const response = await axios.get(config.apiUrl + "v3/wx/forecast/daily/15day", {
            params: queryOptions
        });

        return response.data;
    }
}

export const weatherCompanyService: WeatherCompanyService = new WeatherCompanyService();
