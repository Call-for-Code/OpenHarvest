import { BarChartCard } from 'carbon-addons-iot-react';
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { getDashboardPrecipBar, getDashboardTempBar, PrecipData, TempData } from '../../services/dashboard';

//yeild history by crop
export function BarChartYHC() {

  const [chartData, setChartData] = useState<TempData[]>([]);

  useEffect(() => {
    getDashboardTempBar().then((data) => setChartData(data.temp));
  }, []);


  return(
    <BarChartCard
=======
import React from "react";
=======
import React, { useEffect, useState } from "react";
import { getDashboardPrecipBar, getDashboardTempBar, PrecipData, TempData } from '../../services/dashboard';
>>>>>>> 56f186f9 (data tables)

//yeild history by crop
export function BarChartYHC() {

  const [chartData, setChartData] = useState<TempData[]>([]);

  useEffect(() => {
    getDashboardTempBar().then((data) => setChartData(data.temp));
  }, []);


  return(
<<<<<<< HEAD
  <BarChartCard
>>>>>>> 1b33392b (dasboard UI)
=======
  <div style={{ width: `1400px`, margin: 20 }}>
    <BarChartCard
>>>>>>> 8bc8b7e2 (UI Dashboard)
    availableActions={{
      expand: true,
    }}
    content={{
<<<<<<< HEAD
<<<<<<< HEAD
      categoryDataSourceId: 'month',
      layout: 'VERTICAL',
      series: [
        {
          color: ['blue'],
          dataSourceId: 'temperature',
        },
      ],
      type: 'SIMPLE',
      unit: '°F',
      xLabel: 'Date',
      yLabel: 'Temperature',
=======
      categoryDataSourceId: 'city',
=======
      categoryDataSourceId: 'month',
>>>>>>> acbd48ab (dashboard UI)
      layout: 'VERTICAL',
      series: [
        {
          color: ['blue'],
          dataSourceId: 'temperature',
        },
      ],
      type: 'SIMPLE',
<<<<<<< HEAD
      unit: 'P',
<<<<<<< HEAD
      xLabel: 'Cities',
      yLabel: 'Particles',
>>>>>>> 1b33392b (dasboard UI)
=======
=======
      unit: '°F',
>>>>>>> acbd48ab (dashboard UI)
      xLabel: 'Date',
      yLabel: 'Temperature',
>>>>>>> 8bc8b7e2 (UI Dashboard)
    }}
    i18n={{
      noDataLabel: 'No data for this card.',
    }}
    id="simple-sample"
    locale="en"
    size="MEDIUMWIDE"
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    title="Temperature over Time"
    tooltipDateFormatPattern="L HH:mm:ss"
    values={chartData}
  />  
  )
}


//yield forecast by crop

export function BarChartYFC() {

  const [chartData, setChartData] = useState<PrecipData[]>([]);

  useEffect(() => {
    getDashboardPrecipBar().then((data) => setChartData(data.precip));
  }, []);


  return(
      <BarChartCard
        availableActions={{
          expand: true,
        }}
        content={{
          categoryDataSourceId: 'month',
          layout: 'VERTICAL',
          series: [
            {
              color: ['green'],
              dataSourceId: 'precipitation',
            },
          ],
          type: 'SIMPLE',
          unit: '%',
          xLabel: 'Date',
          yLabel: 'Precipitation',
        }}
        i18n={{
          noDataLabel: 'No data for this card.',
        }}
        id="simple-sample"
        locale="en"
        size="MEDIUMWIDE"
        title="Precipitation over Time"
        tooltipDateFormatPattern="L HH:mm:ss"
        values={chartData}
      />
=======
    title="Particles by city"
=======
    title="Yield History by Crop"
>>>>>>> 8bc8b7e2 (UI Dashboard)
=======
    title="Temperature over Time"
>>>>>>> acbd48ab (dashboard UI)
    tooltipDateFormatPattern="L HH:mm:ss"
    values={chartData}
  />
<<<<<<< HEAD
>>>>>>> 1b33392b (dasboard UI)
=======

  </div>
  
  )
}


//yield forecast by crop

export function BarChartYFC() {

  const [chartData, setChartData] = useState<PrecipData[]>([]);

  useEffect(() => {
    getDashboardPrecipBar().then((data) => setChartData(data.precip));
  }, []);


  return(
    <div style={{ width: `1400px`, margin: 20 }}>
      <BarChartCard
        availableActions={{
          expand: true,
        }}
        content={{
          categoryDataSourceId: 'month',
          layout: 'VERTICAL',
          series: [
            {
              color: ['green'],
              dataSourceId: 'precipitation',
            },
          ],
          type: 'SIMPLE',
          unit: '%',
          xLabel: 'Date',
          yLabel: 'Precipitation',
        }}
        i18n={{
          noDataLabel: 'No data for this card.',
        }}
        id="simple-sample"
        locale="en"
        size="MEDIUMWIDE"
        title="Precipitation over Time"
        tooltipDateFormatPattern="L HH:mm:ss"
        values={chartData}
      />

      
    </div>  

>>>>>>> 8bc8b7e2 (UI Dashboard)
  )
}
