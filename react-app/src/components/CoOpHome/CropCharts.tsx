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

//yeild history by crop
export function BarChartYHC() {
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
    values={[
      {
        month: 'April',
        quarter: '2022-Q2',
        temperature: 44,
      },
      {
        month: 'May',
        quarter: '2020-Q1',
        temperature: 110,
      },
      {
        month: 'June',
        quarter: '2020-Q1',
        temperature: 32,
      },
      {
        month: 'July',
        quarter: '2020-Q1',
        temperature: 120,
      },
      {
        month: 'August',
        quarter: '2020-Q1',
        temperature: 70,
      },
      {
        month: 'September',
        quarter: '2020-Q1',
        temperature: 70,
      },
      {
        month: 'October',
        quarter: '2020-Q1',
        temperature: 44,
      },
      {
        month: 'November',
        quarter: '2020-Q1',
        temperature: 90,
      },
      {
        month: 'December',
        quarter: '2020-Q1',
        temperature: 120,
      },
      {
        month: 'January',
        quarter: '2020-Q1',
        temperature: 110,
      },
      {
        month: 'February',
        quarter: '2020-Q1',
        temperature: 100,
      },
      {
        month: 'March',
        quarter: '2020-Q1',
        temperature: 80,
      },

    ]}
  />
<<<<<<< HEAD
>>>>>>> 1b33392b (dasboard UI)
=======

  </div>
  
  )
}


//yield forecast by crop

export function BarChartYFC() {
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
              dataSourceId: 'temperature',
            },
          ],
          type: 'SIMPLE',
          unit: '%',
          xLabel: 'Date',
          yLabel: 'Temperature',
        }}
        i18n={{
          noDataLabel: 'No data for this card.',
        }}
        id="simple-sample"
        locale="en"
        size="MEDIUMWIDE"
        title="Precipitation over Time"
        tooltipDateFormatPattern="L HH:mm:ss"
        values={[
          {
            month: 'April',
            emissions: 120,
            quarter: '2022-Q2',
            temperature: 50,
          },
          {
            month: 'May',
            emissions: 130,
            quarter: '2020-Q1',
            temperature: 25,
          },
          {
            month: 'June',
            emissions: 30,
            quarter: '2020-Q1',
            temperature: 80,
          },
          {
            month: 'July',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 120,
          },
          {
            month: 'August',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 70,
          },
          {
            month: 'September',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 30,
          },
          {
            month: 'October',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 90,
          },
          {
            month: 'November',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 90,
          },
          {
            month: 'December',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 20,
          },
          {
            month: 'January',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 100,
          },
          {
            month: 'February',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 60,
          },
          {
            month: 'March',
            emissions: 312,
            quarter: '2020-Q1',
            temperature: 80,
          },
    
        ]}
      />

      
    </div>  

>>>>>>> 8bc8b7e2 (UI Dashboard)
  )
}
