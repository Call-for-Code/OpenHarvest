import { BarChartCard } from 'carbon-addons-iot-react';
import React, { useEffect, useState } from "react";
import { getDashboardPrecipBar, getDashboardTempBar, PrecipData, TempData } from '../../services/dashboard';

//yeild history by crop
export function BarChartYHC() {

  const [chartData, setChartData] = useState<TempData[]>([]);

  useEffect(() => {
    getDashboardTempBar().then((data) => setChartData(data.temp));
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
    values={chartData}
  />

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

  )
}
