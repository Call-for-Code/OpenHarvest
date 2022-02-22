import React from "react";
import { Cloudy32, Fog32, Hail32, Haze32, Hurricane32, MixedRainHail32, Moon32, MostlyCloudy32, MostlyCloudyNight32, NotAvailable32, PartlyCloudy32, PartlyCloudyNight32, Rain32, RainDrizzle32, RainHeavy32, RainScattered32, RainScatteredNight32, Sleet32, Smoke32, Snow32, SnowBlizzard32, SnowHeavy32, SnowScattered32, SnowScatteredNight32, Sun32, TemperatureMax32, ThunderstormScattered32, ThunderstormScatteredNight32, ThunderstormStrong32, Tornado32, TropicalStorm32, Windy32, WindyDust32, WindySnow32, WintryMix32 } from "@carbon/icons-react"

export interface Daypart {
    cloudCover: (number | null)[];
    dayOrNight: (string | null)[];
    daypartName: (string | null)[];
    iconCode: (number | null)[];
    iconCodeExtend: (number | null)[];
    narrative: (string | null)[];
    precipChance: (number | null)[];
    precipType: (string | null)[];
    qpf: (number | null)[];
    qpfSnow: (number | null)[];
    qualifierCode: any[];
    qualifierPhrase: any[];
    relativeHumidity: (number | null)[];
    snowRange: (string | null)[];
    temperature: (number | null)[];
    temperatureHeatIndex: (number | null)[];
    temperatureWindChill: (number | null)[];
    thunderCategory: any[];
    thunderIndex: (number | null)[];
    uvDescription: (string | null)[];
    uvIndex: (number | null)[];
    windDirection: (number | null)[];
    windDirectionCardinal: (string | null)[];
    windPhrase: (string | null)[];
    windSpeed: (number | null)[];
    wxPhraseLong: (string | null)[];
    wxPhraseShort: (string | null)[];
}

export interface Forecast {
    calendarDayTemperatureMax: (number | null)[];
    calendarDayTemperatureMin: (number | null)[];
    dayOfWeek: (string | null)[];
    expirationTimeUtc: (number | null)[];
    moonPhase: (string | null)[];
    moonPhaseCode: (string | null)[];
    moonPhaseDay: (number | null)[];
    moonriseTimeLocal: any[];
    moonriseTimeUtc: (number | null)[];
    moonsetTimeLocal: (string | null | Date)[];
    moonsetTimeUtc: (number | null)[];
    narrative: (string | null)[];
    qpf: (number | null)[];
    qpfSnow: (number | null)[];
    sunriseTimeLocal: (string | null | Date)[];
    sunriseTimeUtc: (number | null)[];
    sunsetTimeLocal: (string | null | Date)[];
    sunsetTimeUtc: (number | null)[];
    temperatureMax: (number | null)[];
    temperatureMin: (number | null)[];
    validTimeLocal: (string | null | Date)[];
    validTimeUtc: (number | null)[];
    daypart: Daypart[];
}

export function getIconFromIconCode(iconCode: number) {
    switch (iconCode) {
        case 0: 
            return <Tornado32 />
        case 1: 
            return <TropicalStorm32 />
        case 2: 
            return <Hurricane32 />
        case 3: 
            return <ThunderstormStrong32 />
        case 4: 
            return <ThunderstormStrong32 />
        case 5: 
            return <WintryMix32 />
        case 6: 
            return <MixedRainHail32 />
        case 7: 
            return <WintryMix32 />
        case 8: 
            return <Snow32 />
        case 9: 
            return <RainDrizzle32 />
        case 10: 
            return <WintryMix32 />
        case 11: 
            return <RainDrizzle32 />
        case 12: 
            return <Rain32 />
        case 13: 
            return <Snow32 />
        case 14: 
            return <SnowHeavy32 />
        case 15: 
            return <WindySnow32 />
        case 16: 
            return <Snow32 />
        case 17: 
            return <Hail32 />
        case 18: 
            return <Sleet32 />
        case 19: 
            return <WindyDust32 />
        case 20: 
            return <Fog32 />
        case 21: 
            return <Haze32 />
        case 22: 
            return <Smoke32 />
        case 23: 
            return <Windy32 />
        case 24: 
            return <Windy32 />
        case 25: 
            return <WindySnow32 />
        case 26: 
            return <Cloudy32 />
        case 27: 
            return <MostlyCloudyNight32 />
        case 28: 
            return <MostlyCloudy32 />
        case 29: 
            return <PartlyCloudyNight32 />
        case 30: 
            return <PartlyCloudy32 />
        case 31: 
            return <Moon32 />
        case 32: 
            return <Sun32 />
        case 33: 
            return <PartlyCloudyNight32 />
        case 34: 
            return <PartlyCloudy32 />
        case 35: 
            return <MixedRainHail32 />
        case 36: 
            return <TemperatureMax32 />
        case 37: 
            return <ThunderstormScattered32 />
        case 38: 
            return <ThunderstormScattered32 />
        case 39: 
            return <RainScattered32 />
        case 40: 
            return <RainHeavy32 />
        case 41: 
            return <SnowScattered32 />
        case 42: 
            return <SnowHeavy32 />
        case 43: 
            return <SnowBlizzard32 />
        case 44: 
            return <NotAvailable32 />
        case 45: 
            return <RainScatteredNight32 />
        case 46: 
            return <SnowScatteredNight32 />
        case 47: 
            return <ThunderstormScatteredNight32 />
    }
}
