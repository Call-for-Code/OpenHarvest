import { Add16 } from '@carbon/icons-react';
import { TableCard } from 'carbon-addons-iot-react';
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { Button } from 'carbon-components-react';
import React from "react";


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

    const tableData = [
      {
        id: `row-1`,
        values: {
          crop: 'Charimbana',
          area: 40,
          oneMonth: 100,
          twoMonth: 0,
          threeMonth: 200,
        },
      },
      {
        id: `row-2`,
        values: {
          crop: 'Chatimbana',
          area: 50,
          oneMonth: 100,
          twoMonth: 0,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Baka',
          area: 30,
          oneMonth: 100,
          twoMonth: 0,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Nsinjiro',
          area: 35,
          oneMonth: 100,
          twoMonth: 0,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Kakoma',
          area: 45,
          oneMonth: 100,
          twoMonth: 0,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Chalimbana',
          area: 20,
          oneMonth: 100,
          twoMonth: 0,
          threeMonth: 200,
        },
        
      }
    ];
       
    
    
    return (
      <div>
        <div>
          <p>Yeild History by Crop</p>
        </div >

        <div style={{ width: `700px`, margin: 20 }} >
          <StatefulTable
              id="table"
              columns={columns}
              data={tableData}
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

  const tableData = [
      {
        id: `row-1`,
        values: {
          crop: 'Charimbana',
          area: 40,
          oneMonth: 100,
          twoMonth: 150,
          threeMonth: 200,
        },
      },
      {
        id: `row-2`,
        values: {
          crop: 'Chatimbana',
          area: 50,
          oneMonth: 100,
          twoMonth: 0,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Baka',
          area: 30,
          oneMonth: 100,
          twoMonth: 150,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Nsinjiro',
          area: 35,
          oneMonth: 100,
          twoMonth: 150,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Kakoma',
          area: 45,
          oneMonth: 100,
          twoMonth: 150,
          threeMonth: 200,
        },
        
      },
      {
        id: `row-2`,
        values: {
          crop: 'Chalimbana',
          area: 20,
          oneMonth: 100,
          twoMonth:150,
          threeMonth: 200,
        },
        
      }
    ];
     
  
  
  return (
    <div>
      <div>
        <p>Yeild Forecast by Crop</p>
      </div >

      <div style={{ width: `700px`, margin: 20 }} >
        <StatefulTable
            id="table"
            columns={columns}
            data={tableData}
            view={view}
            actions={actions}
            options={options}
              />
      </div>
      
    </div>
  );

}