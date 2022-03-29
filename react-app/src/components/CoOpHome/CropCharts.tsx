import { BarChartCard } from 'carbon-addons-iot-react';
import React from "react";

export function BarChart() {
  return(
  <BarChartCard
    availableActions={{
      expand: true,
    }}
    content={{
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
    }}
    i18n={{
      noDataLabel: 'No data for this card.',
    }}
    id="simple-sample"
    locale="en"
    size="MEDIUMWIDE"
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
  )
}
