import React, { Component, ReactElement } from "react";
import { PageTitleBar } from "carbon-addons-iot-react";
import { Weather7Day, WeatherToday } from "./WeatherForecast";
import { HomeMap } from "./HomeMap";

type CoOpHomeProps = {};
type CopOpHomeState = {};


export default class CoOpHome extends Component<CoOpHomeProps, CopOpHomeState> {

    render(): ReactElement {
        return <div className="w-full">
            <PageTitleBar
                title={"Home"}
                forceContentOutside
                headerMode={"STATIC"}
                collapsed={false}
            />

            <div className="w-full flex space-x-4">
                <div className="flex-none w-3/12 h-48">
                    <WeatherToday></WeatherToday>
                </div>
                <div className="flex-1 w-9/12 h-48">
                    <Weather7Day></Weather7Day>
                </div>
            </div>

            <div className="w-9/12 h-[500px]">
                <HomeMap></HomeMap>
            </div>
            

        </div>
    }
}
