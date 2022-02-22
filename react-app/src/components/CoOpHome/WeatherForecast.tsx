import React, { useEffect, useState } from "react";
import { Card, CARD_SIZES } from "carbon-addons-iot-react";
import { WeatherAPI } from "./../../services/weather";
import { Forecast, getIconFromIconCode } from "./ForecastTypes";

// Compact forecast interface for the UI 
export interface WeatherDetails {
    daypartName: string;
    /**
     * If false then it's night
     */ 
    isDay: boolean;
    textSummary: string;
    temp: number;
    tempMin: number;
    tempMax: number;
    precipitation: number;
    humidity: number;
    windSpeed: number;
    iconCode: number;
}

const weatherAPI = new WeatherAPI();

function getSummaryFromNarrative(narrative: string) {
    return narrative.split(".")[0];
}

function getDetailsFromForecast(forecast: Forecast, index: number): WeatherDetails {
    const dayParts = forecast.daypart[0];
    const dayIndex = Math.floor(index / 2);
    return {
        daypartName: dayParts.daypartName[index] as string,
        isDay: dayParts.dayOrNight[index] == "D",
        textSummary: getSummaryFromNarrative(dayParts.narrative[0] as string),
        temp: dayParts.temperature[index] as number,
        tempMin: forecast.temperatureMin[dayIndex] as number,
        tempMax: forecast.temperatureMax[dayIndex] as number,
        precipitation: dayParts.precipChance[index] as number,
        humidity: dayParts.relativeHumidity[index] as number,
        windSpeed: dayParts.windSpeed[index] as number,
        iconCode: dayParts.iconCode[index] as number
    }
}

function getTodayForecastDetails(forecast: Forecast): WeatherDetails {
    // The weather API does this funny thing where it nulls the part of the day that has passed
    const daypart = forecast.daypart[0];
    const idx = daypart.dayOrNight[0] !== null ? 0 : 1; // Check if the first elem is null

    return getDetailsFromForecast(forecast, idx);
}

function getWeeklyForecastDetails(forecast: Forecast): WeatherDetails[] {
    const details: WeatherDetails[] = [];
    
    // // Get today's one
    // const dayparts = forecast.daypart[0];
    // const idx = dayparts.dayOrNight[0] !== null ? 0 : 1; // Check if the first elem is null

    // details.push(getDetailsFromForecast(forecast, idx));

    for (let i = 2; i < 14; i+=2) {
        details.push(getDetailsFromForecast(forecast, i));
    }

    return details;
}

export function WeatherToday() {
    const [forecast, setForecast] = useState<Forecast | null>(null);

    useEffect(() => {
        weatherAPI.farmerForecast().then(setForecast);
    }, []);

    if (forecast == null) {
        return (
            <Card
                title={"Weather"}
                size={CARD_SIZES.MEDIUMTHIN}
                style={{ height: '200px' }}
                tooltip={<p>Hello</p>}
                // onCardAction={mockOnCardAction}
                // availableActions={{ expand: true, range: DATE_PICKER_OPTIONS.ICON_ONLY }}
            >
                Loading...
            </Card>
        )
    }
    else {
        const details = getTodayForecastDetails(forecast);
        return (
            <Card
                title={"Weather"}
                size={CARD_SIZES.MEDIUMTHIN}
                style={{ height: '200px' }}
                tooltip={<p>Hello</p>}
                // onCardAction={mockOnCardAction}
                // availableActions={{ expand: true, range: DATE_PICKER_OPTIONS.ICON_ONLY }}
            >
                <div>
                    {details.daypartName}    
                </div>
                <div className="flex">
                    <div className="flex-none w-5/12">
                        <span className="text-[48px] leading-normal">{details.temp}</span>
                        <span className="align-top">°C</span>
                    </div>
                    <div className="flex-1 w-7/12">
                        <p className="text-sm">Precipitation: {details.precipitation}%</p>
                        <p className="text-sm">Humidity: {details.humidity}%</p>
                        <p className="text-sm">Wind: {details.windSpeed} km/h</p>
                    </div>
                </div>
                <div>
                    {getIconFromIconCode(details.iconCode)}
                    {details.textSummary}
                </div>
                
            </Card>
            
        )
    }
}

export function Weather7Day() {
    const [forecast, setForecast] = useState<any>(null);

    useEffect(() => {
        weatherAPI.farmerForecast().then(setForecast);
    }, []);

    if (forecast == null) {
        return (
            <Card
                title={"Weather"}
                size={CARD_SIZES.MEDIUMTHIN}
                style={{ height: '200px' }}
                tooltip={<p>Hello</p>}
                // onCardAction={mockOnCardAction}
                // availableActions={{ expand: true, range: DATE_PICKER_OPTIONS.ICON_ONLY }}
            >
                Loading...
            </Card>
        )
    }
    else {
        const details = getWeeklyForecastDetails(forecast);
        console.log(details);
        return (
            <Card
                title={"Weather Forecast"}
                size={CARD_SIZES.MEDIUMTHIN}
                style={{ height: '200px' }}
                tooltip={<p>Hello</p>}
                // onCardAction={mockOnCardAction}
                // availableActions={{ expand: true, range: DATE_PICKER_OPTIONS.ICON_ONLY }}
            >
                <div className="flex">
                    {details.map((item) => {
                        return (
                        <div className="flex-1">
                            <div>
                                {item.daypartName}
                            </div>
                            <div className="flex">
                                <div className="flex-none w-6/12">
                                    <span className="text-[48px] leading-normal">{item.tempMax}</span>
                                    <span className="align-top">°C</span>
                                </div>
                                <div className="flex-1 w-6/12">
                                <span className="text-[48px] leading-normal">{item.tempMin}</span>
                                    <span className="align-top">°C</span>
                                </div>
                            </div>
                            <div>
                                {getIconFromIconCode(item.iconCode)}
                                {item.textSummary}
                            </div>
                        </div>)

                    })}                    
                </div>
            </Card>
        )

    }
}