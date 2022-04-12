import React, { Component, ReactElement } from "react";
import { PageTitleBar } from "carbon-addons-iot-react";
import { Weather7Day, WeatherToday } from "./WeatherForecast";
import { HomeMap } from "./HomeMap";
import { PiChartGNT, PiChartGNY } from "./pigraph";
import { BarChartYFC, BarChartYHC } from "./CropCharts";
<<<<<<< HEAD
<<<<<<< HEAD
import { YHBCTable, YFBCTable } from "./DataTable";
=======
import { Table } from "./DataTable";
>>>>>>> 8bc8b7e2 (UI Dashboard)
=======
import { YHBCTable, YFBCTable } from "./DataTable";
>>>>>>> 56f186f9 (data tables)
import { LandAreaCard, NumCropsCard, NumFarmersCard, PrecipWeekCard } from "./DataCards";

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

            <div className="flex space-x-4 m-[20px]">
                <div className="flex-none w-3/12 h-48">
                    <WeatherToday></WeatherToday>
                </div>
                <div className="flex-1 w-9/12 h-48">
                    <Weather7Day></Weather7Day>
                </div>
            </div>

            {/* <div className="w-9/12 h-[500px]">
                <HomeMap></HomeMap>
            </div> */}
            
            <div className="m-[20px]">
                <BarChartYFC></BarChartYFC>
            </div>

            <div className="m-[20px]">
                <BarChartYHC></BarChartYHC>
            </div>

            <div className="m-[20px] space-y-[20px] md:flex md:flex-row md:space-x-[20px] md:space-y-0 justify-between">
                <div className="w-full">
                    <LandAreaCard></LandAreaCard>
                </div>
                <div className="w-full">
                    <NumCropsCard></NumCropsCard>
                </div>
                <div className="w-full">
                    <NumFarmersCard></NumFarmersCard>
                </div>
                <div className="w-full">
                    <PrecipWeekCard></PrecipWeekCard>
                </div>
            </div>

            <div className="m-[20px] space-y-[20px] md:flex md:flex-row md:space-x-[20px] md:space-y-0 justify-between">
                <div className="w-full">
                    <YHBCTable></YHBCTable>
                </div>
                <div className="w-full">
                    <YFBCTable></YFBCTable>
                </div>
            </div>

            <div className="m-[20px] space-y-[20px] md:flex md:flex-row md:space-x-[20px] md:space-y-0 justify-between">
                <div className="w-full h-full">
                    <PiChartGNT></PiChartGNT>
                </div>
                <div className="w-full h-full">
                    <PiChartGNY></PiChartGNY>
                </div>
            </div>
            
            <div>
                <BarChartYFC></BarChartYFC>
                <BarChartYHC></BarChartYHC>
            </div>
            <div  className="flex">
                <LandAreaCard></LandAreaCard>         
                <NumCropsCard></NumCropsCard>
                <NumFarmersCard></NumFarmersCard>
                <PrecipWeekCard></PrecipWeekCard>
            </div>
            <div className="flex">
                <YHBCTable></YHBCTable>
                <PiChartGNT></PiChartGNT>
                
            </div>
            <div className="flex">
                <YFBCTable></YFBCTable>
                <PiChartGNY></PiChartGNY>
            </div>
            

        </div>
    }
}
