import { TableCard } from 'carbon-addons-iot-react';
import React from "react";


export function Table() {
    const onCardAction = jest.fn();

    const tableData = [
        {
          id: `row-1`,
          values: {
            alert: 'AHI005 Asset failure',
            count: 1.2039201932,
            hour: 1563877570000,
            long_description: 'long description for a given event payload',
            pressure: 0,
          },
        },
        {
          id: `row-2`,
          values: {
            alert: 'AHI003 process need to optimize adjust X variables',
            count: 1.10329291,
            hour: 1563873970000,
            long_description: 'long description for a given event payload',
            pressure: 2,
          },
        },
        {
          id: `row-3`,
          values: {
            alert: 'AHI001 proccess need to optimize adjust Y variables',
            count: 3,
            hour: 1564756946000,
            long_description: 'long description for a given event payload',
            pressure: 10,
          },
        },
        {
          id: `row-4`,
          values: {
            alert: 'AHI001 proccess need to optimize adjust Y variables',
            count: 5,
            hour: 1563877570000,
            other_description: 'other description for a given event payload',
            long_description: 'long description for a given event payload',
            pressure: 0,
          },
        },
        {
          id: `row-5`,
          values: {
            alert: 'AHI001 proccess need to optimize',
            count: 10,
            hour: 1563874210000,
            pressure: 10,
            temperature: 80,
          },
        },
        {
          id: `row-6`,
          values: {
            alert: 'AHI001 proccess need to optimize.',
            count: 30,
            hour: 1563874210000,
            pressure: 68,
          },
        },
        {
          id: `row-7`,
          values: {
            alert: 'AHI001 proccess need to optimize',
            count: 9,
            hour: 1563870610000,
            pressure: 0,
          },
        },
        {
          id: `row-8`,
          values: {
            alert: 'AHI001 proccess need to optimize adjust Y variables',
            count: 7,
            hour: 1563870610000,
            pressure: 0,
          },
        },
        {
          id: `row-9`,
          values: {
            alert: 'AHI001 proccess need to optimize adjust Y variables',
            count: 0,
            hour: 1563873970000,
            pressure: 0,
          },
        },
        {
          id: `row-10`,
          values: {
            alert: 'AHI010 proccess need to optimize adjust Y variables',
            count: 2,
            hour: 1563873970000,
            pressure: 0,
          },
        },
        {
          id: `row-11`,
          values: {
            alert: 'AHI010 proccess need to optimize adjust Y variables',
            count: 5,
            hour: 1563877570000,
            pressure: 1,
          },
        },
      ];
      const tableColumns = [
        {
          dataSourceId: 'alert',
          label: 'Alert',
          priority: 1,
        },
        {
          dataSourceId: 'count',
          label: 'Count',
          priority: 3,
          filter: { placeholderText: 'enter a string' },
        },
        {
          dataSourceId: 'hour',
          label: 'Hour',
          priority: 2,
          type: 'TIMESTAMP',
        },
        {
          dataSourceId: 'pressure',
          label: 'Pressure',
          priority: 2,
        },
      ];        
    const thresholds = [
        // this threshold is applied to the whole row, not a particular attribute
        {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3, // High threshold, medium, or low used for sorting and defined filtration
        label:'Pressue',
        showSeverityLabel:  true,
        severityLabel: 'Critical',
        },
        {
        dataSourceId: 'count',
        comparison: '>=',
        value: 10,
        severity: 1, // High threshold, medium, or low used for sorting and defined filtration
        showSeverityLabel:  true,
        severityLabel: 'Critical',
        },
        {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2, // High threshold, medium, or low used for sorting and defined filtration
        showSeverityLabel:  true,
        severityLabel: 'Critical',
        },
        {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
        label: 'Pressue',
        showSeverityLabel: true,
        severityLabel: 'Critical',
        },
    ];
    
    return (
        <div style={{ width: `700px`, margin: 20 }}>
        <TableCard
            title="Yield history by crop"
            id="table-list"
            tooltip="Here's a Tooltip"
            content={{
            columns: tableColumns,
            thresholds,
            }}
            values={ tableData}
            onCardAction={    onCardAction  }
            size={100}
            isLoading= {false}
        />
        </div>
    );

}