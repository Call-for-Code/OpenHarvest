import { Add16 } from '@carbon/icons-react';
import { TableCard } from 'carbon-addons-iot-react';
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { Button } from 'carbon-components-react';
import React, { useEffect, useState } from "react";
import { getDashboardDataTable, TableData } from '../../services/dashboard';


const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: () => {},
  },
  toolbar: {
    onApplyFilter: () => {},
    onToggleFilter: () => {},
    onShowRowEdit: () => {},
    onToggleColumnSelection: () => {},
    /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
    onClearAllFilters: () => {},
    onCancelBatchAction: () => {},
    onApplyBatchAction: () => {},
    onApplySearch: () => {},
    /** advanced filter actions */
    onCancelAdvancedFilter: () => {},
    onRemoveAdvancedFilter: () => {},
    onCreateAdvancedFilter: () => {},
    onChangeAdvancedFilter: () => {},
    onApplyAdvancedFilter: () => {},
    onToggleAdvancedFilter: () => {},
  },
  table: {
    onRowClicked: () => {},
    onRowSelected: () => {},
    onSelectAll: () => {},
    onEmptyStateAction: () => {},
    onApplyRowAction: () => {},
    onRowExpanded: () => {},
    onChangeOrdering: () => {},
    onColumnSelectionConfig: () => {},
    onChangeSort: () => {},
    onColumnResize: () => {},
    onOverflowItemClicked: () => {},
  },
};

const columns = [
  {
      id: 'crop',
      name: 'Crop'
  },
  {
      id: 'area',
      name: 'Planted Area (ha)'
  },
  {   id: 'oneMonth',
      name: '1 month'
  },
  {
      id: 'twoMonth',
      name: '2 month'
  },
  {
      id: 'threeMonth',
      name: '3 month'
  } 
]

const options = {
  hasRowSelection: 'single',
  hasSearch: false,    
}

const view = {
  toolbar: {
      // toolbarActions: [
      //     {
      //         id: 'edit',
      //         labelText: 'Add',
      //         // can be a handful of included icons
      //         renderIcon: Add16,
      //         isOverflow: false,
      //     },
      // ]
      search: {
          defaultExpanded: false
      }
  }
}

//Yield history by crop
export function YHBCTable() {

    const [chartData, setChartData] = useState<TableData[]>([]);

    useEffect(() => {
      getDashboardDataTable().then((data) => setChartData(data.YieldHistory));
    }, []);
    
    
    return (
      <div>
        <div>
          <p>Yeild History by Crop</p>
        </div >

        <div style={{ width: `700px`, margin: 20 }} >
          <StatefulTable
              id="table"
              columns={columns}
              data={chartData}
              view={view}
              actions={actions}
              options={options}
                />
        </div>
        
      </div>
    );

}

//Yield forecast by crop
export function YFBCTable() {

  const [chartData, setChartData] = useState<TableData[]>([]);

    useEffect(() => {
      getDashboardDataTable().then((data) => setChartData(data.YieldForecast));
    }, []);
    
     
  
  
  return (
    <div>
      <div>
        <p>Yeild Forecast by Crop</p>
      </div >

      <div style={{ width: `700px`, margin: 20 }} >
        <StatefulTable
            id="table"
            columns={columns}
            data={chartData}
            view={view}
            actions={actions}
            options={options}
              />
      </div>
      
    </div>
  );

}