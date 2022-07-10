import axios from "axios";
import { GeoCode, Languages, Units, CommonOptions, Formats } from "./weather-company-api.types";

const testForecastData = {"calendarDayTemperatureMax":[21,22,24,24,24,24,24,24,25,25,25,25,24,25,25],"calendarDayTemperatureMin":[18,17,17,17,16,17,17,17,17,17,17,17,17,17,17],"dayOfWeek":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"expirationTimeUtc":[1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951,1645343951],"moonPhase":["Waning Gibbous","Waning Gibbous","Waning Gibbous","Waning Gibbous","Last Quarter","Waning Crescent","Waning Crescent","Waning Crescent","Waning Crescent","Waning Crescent","New","Waxing Crescent","Waxing Crescent","Waxing Crescent","Waxing Crescent"],"moonPhaseCode":["WNG","WNG","WNG","WNG","LQ","WNC","WNC","WNC","WNC","WNC","N","WXC","WXC","WXC","WXC"],"moonPhaseDay":[18,19,20,21,22,24,25,26,27,28,29,1,2,3,3],"moonriseTimeLocal":["2022-02-20T21:05:50+0200","2022-02-21T21:47:27+0200","2022-02-22T22:31:47+0200","2022-02-23T23:21:30+0200","","2022-02-25T00:15:43+0200","2022-02-26T01:15:50+0200","2022-02-27T02:18:43+0200","2022-02-28T03:23:17+0200","2022-03-01T04:25:19+0200","2022-03-02T05:25:08+0200","2022-03-03T06:20:36+0200","2022-03-04T07:13:59+0200","2022-03-05T08:04:43+0200","2022-03-06T08:54:39+0200"],"moonriseTimeUtc":[1645383950,1645472847,1645561907,1645651290,null,1645740943,1645830950,1645921123,1646011397,1646101519,1646191508,1646281236,1646370839,1646460283,1646549679],"moonsetTimeLocal":["2022-02-20T08:50:23+0200","2022-02-21T09:43:37+0200","2022-02-22T10:38:23+0200","2022-02-23T11:37:00+0200","2022-02-24T12:37:49+0200","2022-02-25T13:41:32+0200","2022-02-26T14:44:20+0200","2022-02-27T15:45:07+0200","2022-02-28T16:40:27+0200","2022-03-01T17:31:14+0200","2022-03-02T18:16:18+0200","2022-03-03T18:58:16+0200","2022-03-04T19:37:52+0200","2022-03-05T20:15:34+0200","2022-03-06T20:53:52+0200"],"moonsetTimeUtc":[1645339823,1645429417,1645519103,1645609020,1645699069,1645789292,1645879460,1645969507,1646059227,1646148674,1646237778,1646326696,1646415472,1646504134,1646592832],"narrative":["Thunderstorms developing in the afternoon. Highs 20 to 22ºC and lows 16 to 18ºC.","Thunderstorms. Highs 21 to 23ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 23 to 25ºC and lows 16 to 18ºC.","Thunderstorms developing in the afternoon. Highs 23 to 25ºC and lows 15 to 17ºC.","Thunderstorms. Highs 23 to 25ºC and lows 16 to 18ºC.","Thunderstorms. Highs 23 to 25ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 23 to 25ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 23 to 25ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 24 to 26ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 24 to 26ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 24 to 26ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 24 to 26ºC and lows 16 to 18ºC.","Thunderstorms. Highs 23 to 25ºC and lows 16 to 18ºC.","Thunderstorms. Highs 24 to 26ºC and lows 16 to 18ºC.","Scattered thunderstorms. Highs 24 to 26ºC and lows 15 to 17ºC."],"qpf":[1.64,8,3.47,1.64,7.29,5.77,3.96,3.2,1.8,4.84,4,4.2,4.77,5.43,4.05],"qpfSnow":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"sunriseTimeLocal":["2022-02-20T05:48:00+0200","2022-02-21T05:48:16+0200","2022-02-22T05:48:31+0200","2022-02-23T05:48:45+0200","2022-02-24T05:48:59+0200","2022-02-25T05:49:13+0200","2022-02-26T05:49:26+0200","2022-02-27T05:49:38+0200","2022-02-28T05:49:50+0200","2022-03-01T05:50:02+0200","2022-03-02T05:50:13+0200","2022-03-03T05:50:24+0200","2022-03-04T05:50:34+0200","2022-03-05T05:50:44+0200","2022-03-06T05:50:53+0200"],"sunriseTimeUtc":[1645328880,1645415296,1645501711,1645588125,1645674539,1645760953,1645847366,1645933778,1646020190,1646106602,1646193013,1646279424,1646365834,1646452244,1646538653],"sunsetTimeLocal":["2022-02-20T18:16:07+0200","2022-02-21T18:15:38+0200","2022-02-22T18:15:08+0200","2022-02-23T18:14:38+0200","2022-02-24T18:14:06+0200","2022-02-25T18:13:35+0200","2022-02-26T18:13:02+0200","2022-02-27T18:12:29+0200","2022-02-28T18:11:56+0200","2022-03-01T18:11:21+0200","2022-03-02T18:10:47+0200","2022-03-03T18:10:11+0200","2022-03-04T18:09:36+0200","2022-03-05T18:09:00+0200","2022-03-06T18:08:23+0200"],"sunsetTimeUtc":[1645373767,1645460138,1645546508,1645632878,1645719246,1645805615,1645891982,1645978349,1646064716,1646151081,1646237447,1646323811,1646410176,1646496540,1646582903],"temperatureMax":[21,22,24,24,24,24,24,24,25,25,25,25,24,25,25],"temperatureMin":[17,17,17,16,17,17,17,17,17,17,17,17,17,17,16],"validTimeLocal":["2022-02-20T07:00:00+0200","2022-02-21T07:00:00+0200","2022-02-22T07:00:00+0200","2022-02-23T07:00:00+0200","2022-02-24T07:00:00+0200","2022-02-25T07:00:00+0200","2022-02-26T07:00:00+0200","2022-02-27T07:00:00+0200","2022-02-28T07:00:00+0200","2022-03-01T07:00:00+0200","2022-03-02T07:00:00+0200","2022-03-03T07:00:00+0200","2022-03-04T07:00:00+0200","2022-03-05T07:00:00+0200","2022-03-06T07:00:00+0200"],"validTimeUtc":[1645333200,1645419600,1645506000,1645592400,1645678800,1645765200,1645851600,1645938000,1646024400,1646110800,1646197200,1646283600,1646370000,1646456400,1646542800],"daypart":[{"cloudCover":[94,92,83,84,73,61,57,59,67,66,68,69,59,68,64,64,49,62,52,72,57,68,56,53,66,52,68,70,60,62],"dayOrNight":["D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N"],"daypartName":["Today","Tonight","Tomorrow","Tomorrow night","Tuesday","Tuesday night","Wednesday","Wednesday night","Thursday","Thursday night","Friday","Friday night","Saturday","Saturday night","Sunday","Sunday night","Monday","Monday night","Tuesday","Tuesday night","Wednesday","Wednesday night","Thursday","Thursday night","Friday","Friday night","Saturday","Saturday night","Sunday","Sunday night"],"iconCode":[38,11,4,47,38,47,38,47,4,47,4,47,38,47,38,29,38,29,38,47,38,47,38,47,4,4,4,4,38,11],"iconCodeExtend":[7203,1140,400,3809,3800,6200,7203,3809,400,3809,400,3809,3800,3809,3800,2900,3800,2900,3800,3809,3800,3809,3800,3809,400,400,400,400,3800,1100],"narrative":["Thunderstorms developing in the afternoon. High 21ºC. Winds WSW at 10 to 15 km/h. Chance of rain 40%.","Thundershowers. Low 17ºC. Winds WSW and variable. Chance of rain 40%.","Thunderstorms. High 22ºC. Winds SW at 10 to 15 km/h. Chance of rain 80%.","Scattered thunderstorms. Low 17ºC. Winds SW and variable. Chance of rain 50%.","Scattered thunderstorms. High 24ºC. Winds S at 10 to 15 km/h. Chance of rain 50%.","Thunderstorms early. Low 17ºC. Winds S and variable. Chance of rain 40%.","Thunderstorms developing in the afternoon. High 24ºC. Winds S at 10 to 15 km/h. Chance of rain 50%.","Scattered thunderstorms. Low 16ºC. Winds SSE and variable. Chance of rain 40%.","Thunderstorms. High 24ºC. Winds S and variable. Chance of rain 70%.","Scattered thunderstorms. Low 17ºC. Winds NW and variable. Chance of rain 60%.","Thunderstorms. High 24ºC. Winds WNW and variable. Chance of rain 70%.","Scattered thunderstorms. Low 17ºC. Winds SW and variable. Chance of rain 60%.","Scattered thunderstorms. High 24ºC. Winds SSW at 10 to 15 km/h. Chance of rain 50%.","Scattered thunderstorms. Low 17ºC. Winds SE and variable. Chance of rain 50%.","Scattered thunderstorms. High 24ºC. Winds SSE at 10 to 15 km/h. Chance of rain 50%.","Partly cloudy. Low 17ºC. Winds SE and variable.","Scattered thunderstorms. High 25ºC. Winds SSE at 10 to 15 km/h. Chance of rain 40%.","Partly cloudy. Low 17ºC. Winds ESE and variable.","Scattered thunderstorms. High 25ºC. Winds SE at 10 to 15 km/h. Chance of rain 60%.","Scattered thunderstorms. Low 17ºC. Winds SE and variable. Chance of rain 50%.","Scattered thunderstorms. High 25ºC. Winds SSE at 10 to 15 km/h. Chance of rain 50%.","Scattered thunderstorms. Low 17ºC. Winds SSE and variable. Chance of rain 50%.","Scattered thunderstorms. High 25ºC. Winds SSE at 10 to 15 km/h. Chance of rain 50%.","Scattered thunderstorms. Low 17ºC. Winds SSE and variable. Chance of rain 50%.","Thunderstorms. High 24ºC. Winds SSE at 10 to 15 km/h. Chance of rain 60%.","Thunderstorms. Low 17ºC. Winds SSE and variable. Chance of rain 60%.","Thunderstorms. High 25ºC. Winds SSE at 10 to 15 km/h. Chance of rain 60%.","Thunderstorms. Low 17ºC. Winds SSE and variable. Chance of rain 60%.","Scattered thunderstorms. High 25ºC. Winds SSE at 10 to 15 km/h. Chance of rain 50%.","Showers. Low 16ºC. Winds SSE and variable. Chance of rain 50%."],"precipChance":[40,42,78,47,51,43,45,42,68,55,74,58,53,53,54,24,44,24,57,51,53,51,50,45,60,60,60,60,51,50],"precipType":["rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain","rain"],"qpf":[0.3,1.34,6.46,1.54,2.6,0.86,0.84,0.8,4.73,2.56,4.5,1.26,2.76,1.2,3,0,1.56,0,3.3,1.54,2.6,1.4,2.9,1.3,3.24,1.53,4.03,1.4,2.9,1.15],"qpfSnow":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"qualifierCode":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"qualifierPhrase":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"relativeHumidity":[90,96,87,94,79,95,78,94,81,94,80,95,80,96,79,96,76,94,75,93,74,93,75,94,77,94,77,94,77,96],"snowRange":["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],"temperature":[21,17,22,17,24,17,24,16,24,17,24,17,24,17,24,17,25,17,25,17,25,17,25,17,24,17,25,17,25,16],"temperatureHeatIndex":[22,20,23,21,25,21,24,20,24,21,24,21,24,21,25,21,27,21,27,21,26,21,25,21,25,21,25,21,25,20],"temperatureWindChill":[20,18,18,18,19,17,18,17,18,17,18,17,18,17,18,17,18,17,18,17,19,17,18,17,18,17,18,17,18,17],"thunderCategory":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"thunderIndex":[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,0],"uvDescription":["High","Low","Very High","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low","Extreme","Low"],"uvIndex":[7,0,10,0,11,0,11,0,11,0,11,0,11,0,11,0,11,0,11,0,11,0,11,0,11,0,11,0,11,0],"windDirection":[240,250,232,228,189,183,171,157,171,326,295,229,195,145,163,139,156,113,146,124,150,149,156,162,158,155,150,154,152,160],"windDirectionCardinal":["WSW","WSW","SW","SW","S","S","S","SSE","S","NW","WNW","SW","SSW","SE","SSE","SE","SSE","ESE","SE","SE","SSE","SSE","SSE","SSE","SSE","SSE","SSE","SSE","SSE","SSE"],"windPhrase":["Winds WSW at 10 to 15 km/h.","Winds WSW and variable.","Winds SW at 10 to 15 km/h.","Winds SW and variable.","Winds S at 10 to 15 km/h.","Winds S and variable.","Winds S at 10 to 15 km/h.","Winds SSE and variable.","Winds S and variable.","Winds NW and variable.","Winds WNW and variable.","Winds SW and variable.","Winds SSW at 10 to 15 km/h.","Winds SE and variable.","Winds SSE at 10 to 15 km/h.","Winds SE and variable.","Winds SSE at 10 to 15 km/h.","Winds ESE and variable.","Winds SE at 10 to 15 km/h.","Winds SE and variable.","Winds SSE at 10 to 15 km/h.","Winds SSE and variable.","Winds SSE at 10 to 15 km/h.","Winds SSE and variable.","Winds SSE at 10 to 15 km/h.","Winds SSE and variable.","Winds SSE at 10 to 15 km/h.","Winds SSE and variable.","Winds SSE at 10 to 15 km/h.","Winds SSE and variable."],"windSpeed":[12,7,14,6,15,8,14,9,9,5,10,5,12,7,11,6,10,7,10,6,10,7,12,7,12,7,11,7,12,7],"wxPhraseLong":["PM T-Storms","T-Showers","T-Storms","Scattered T-Storms","Scattered T-Storms","T-Storms Early","PM T-Storms","Scattered T-Storms","T-Storms","Scattered T-Storms","T-Storms","Scattered T-Storms","Scattered T-Storms","Scattered T-Storms","Scattered T-Storms","Partly Cloudy","Scattered T-Storms","Partly Cloudy","Scattered T-Storms","Scattered T-Storms","Scattered T-Storms","Scattered T-Storms","Scattered T-Storms","Scattered T-Storms","T-Storms","T-Storms","T-Storms","T-Storms","Scattered T-Storms","Showers"],"wxPhraseShort":["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]}]}

const apiRequestLimit = 50; // It's really 100 per minute
let apiRequestCounter = 0;

export class WeatherCompanyAPI {

    defaultOptions: CommonOptions;

    baseAPI = "https://api.weather.com/"

    constructor(private apiKey = process.env.weather_company_apiKey as string, private unit = Units.metric, private language = Languages.English, private format = Formats.JSON) {
        if (apiKey == undefined) {
            console.error("Weather Company API isn't defined!");
            console.error("Please set it on the 'weather_company_apiKey' env variable or pass it to the constructor");
            throw new Error("Please pass an API key to the Weather API");
        }

        this.defaultOptions = {
            format: Formats.JSON,
            language,
            units: unit
        }

        // setup API throttler, every minute it resets the apiRequestLimit
        setInterval(() => {
            apiRequestCounter = 0;
        }, 1000 * 60);
    }

    GeoCodeToString(geocode: GeoCode) {
        return `${geocode.latitude},${geocode.longitude}`
    }

    apiHitCounter() {
        if (apiRequestCounter >= apiRequestLimit) {
            throw new Error("Too many Requests");
        }
        else {
            apiRequestCounter++;
        }
    }

    async daily15DayForecast(geocode: GeoCode, commonOptions = this.defaultOptions) {
        const paramOptions = {
            geocode: this.GeoCodeToString(geocode),
            apiKey: this.apiKey
        }
        const queryOptions = Object.assign({}, commonOptions, paramOptions);

        this.apiHitCounter()

        const response = await axios.get(this.baseAPI + "v3/wx/forecast/daily/15day", {
            params: queryOptions
        });

        return response.data;

        // return testForecastData;
    }
    
    async sixMonthHistory(geocode: GeoCode, commonOptions = this.defaultOptions) {
        const paramOptions = {
            geocode: this.GeoCodeToString(geocode),
            apiKey: this.apiKey
        }
        const queryOptions = Object.assign({}, commonOptions, paramOptions);

        this.apiHitCounter()

        const response = await axios.get(this.baseAPI + "v3/wx/almanac/monthly/6month", {
            params: queryOptions
        });

        return response.data;

        // return testForecastData;
    }

    async twelveMonthHistory(geocode: GeoCode, commonOptions = this.defaultOptions) {
        const paramOptions = {
            geocode: this.GeoCodeToString(geocode),
            apiKey: this.apiKey
        }
        const queryOptions = Object.assign({}, commonOptions, paramOptions);

        this.apiHitCounter()

        const response = await axios.get(this.baseAPI + "v3/wx/almanac/monthly/6month", {
            params: queryOptions
        });

        return response.data;

        // return testForecastData;
    }
}
