import React, { Component, ReactElement, useEffect, useState } from "react";
import { TextArea } from "carbon-components-react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { Farmer, getAllFarmers } from "../../services/farmers";
import { Chat32 } from "@carbon/icons-react";


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
      onApplyBatchAction: (actionId: string, rowIds: string[]) => {}, // defined so that TS doesn't complain when we override them below
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
        id: 'name',
        name: 'Farmer Name',
    },
    {
        id: 'mobile',
        name: 'Contact',
    },
    {
        id: 'fieldsLen',
        name: 'Fields Owned',
    }   
]

const view = {
    toolbar: {
        batchActions: [
            {
                iconDescription: 'Message',
                id: 'message',
                labelText: 'Message',
                renderIcon: Chat32
            },
        ],
        search: {
            defaultExpanded: true
        }
    }
}

const options = {
    hasRowSelection: 'single',
    hasSearch: true,    
}

export function Messaging() {

    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [farmerTableData, setFarmerTableData] = useState<any>([]);

    useEffect(() => {
        async function load() {
            const farmers = await getAllFarmers();
            setFarmers(farmers);
            const tableData = farmers.map((it, i) => {
                return {
                    id: `row-id-${i}`,
                    values: {
                        name: it.name,
                        mobile: it.mobile,
                        fieldsLen: it.fieldCount
                    }
                }
            });
            setFarmerTableData(tableData);
        }

        load();
    }, []);


    /**
     * Layout:
     * Text Area For the message
     * Table with Farmers
     * 
     * User can select multiple farmers and send out a message to them using batch actions
     */
    return <div className="flex flex-col space-y-5">
        <PageTitleBar
            title={"Message a Farmer"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />
        <TextArea labelText="Message" />
        <StatefulTable
            id="table"
            columns={columns}
            data={farmerTableData}
            view={view}
            actions={actions}
            options={options}
        />
    </div>
}