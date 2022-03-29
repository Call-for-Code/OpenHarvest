import { BarChartCard } from 'carbon-addons-iot-react';
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

export function BarChart() {
  return(
  <BarChartCard
>>>>>>> 1b33392b (dasboard UI)
    availableActions={{
      expand: true,
    }}
    content={{
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
      layout: 'VERTICAL',
      series: [
        {
          color: ['blue', 'red', 'green', 'yellow'],
          dataSourceId: 'particles',
        },
      ],
      type: 'SIMPLE',
      unit: 'P',
      xLabel: 'Cities',
      yLabel: 'Particles',
>>>>>>> 1b33392b (dasboard UI)
    }}
    i18n={{
      noDataLabel: 'No data for this card.',
    }}
    id="simple-sample"
    locale="en"
    size="MEDIUMWIDE"
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
    tooltipDateFormatPattern="L HH:mm:ss"
    values={[
      {
        city: 'Amsterdam',
        emissions: 120,
        particles: 447,
        quarter: '2020-Q1',
        temperature: 44,
      },
      {
        city: 'New York',
        emissions: 130,
        particles: 528,
        quarter: '2020-Q1',
        temperature: 11,
      },
      {
        city: 'Bangkok',
        emissions: 30,
        particles: 435,
        quarter: '2020-Q1',
        temperature: 32,
      },
      {
        city: 'San Francisco',
        emissions: 312,
        particles: 388,
        quarter: '2020-Q1',
        temperature: 120,
      },
    ]}
  />
>>>>>>> 1b33392b (dasboard UI)
  )
}
