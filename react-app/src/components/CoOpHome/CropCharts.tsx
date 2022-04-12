import { BarChartCard } from 'carbon-addons-iot-react';
import React from "react";

//yeild history by crop
export function BarChartYHC() {
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
          color: ['blue'],
          dataSourceId: 'temperature',
        },
      ],
      type: 'SIMPLE',
      unit: '°F',
      xLabel: 'Date',
      yLabel: 'Temperature',
    }}
    i18n={{
      noDataLabel: 'No data for this card.',
    }}
    id="simple-sample"
    locale="en"
    size="MEDIUMWIDE"
    title="Temperature over Time"
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

  )
}
