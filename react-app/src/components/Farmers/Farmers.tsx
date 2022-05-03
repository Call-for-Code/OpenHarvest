import React, { Component, ReactElement, useEffect, useState } from "react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { Farmer, getAllFarmers } from "../../services/farmers";
import { Button } from "carbon-components-react";
import { Add16, View16 } from "@carbon/icons-react";
import { useHistory } from "react-router";

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
      onApplyRowAction: (actionId: string, rowId: string) => {},
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

const options = {
    hasRowSelection: 'single',
    hasSearch: true,
    hasRowActions: true,
}

export default function Farmers() {

    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [farmerTableData, setFarmerTableData] = useState<any>([]);

    const history = useHistory();

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
            customToolbarContent: (
                <Button
                  kind="primary"
                  iconDescription="Add Farmer"
                  renderIcon={Add16}
                  onClick={() => history.push("farmers/add")}
                >
                    Add Farmer
                </Button>
            ),
            search: {
                defaultExpanded: true
            }
        }
    }

    actions.table.onApplyRowAction = (actionId: string, rowId: string) => {
        console.log(actionId, rowId);
        history.push(`farmers/${rowId}`);
    };
    

    useEffect(() => {
        async function load() {
            const farmers = await getAllFarmers();
            setFarmers(farmers);
            const tableData = farmers.map((it, i) => {
                return {
                    id: it._id,
                    values: {
                        name: it.name,
                        mobile: it.mobile,
                        fieldsLen: it.fieldCount
                    },
                    rowActions: [{
                        id: 'view',
                        renderIcon: View16,
                        iconDescription: 'View Farmer Details',
                        labelText: 'More Details'
                    }]
                }
            });
            setFarmerTableData(tableData);
        }

        load();
    }, []);

    return <div className="w-9/12 mx-auto space-y-5">
        
            <PageTitleBar
                title={"Farmers"}
                forceContentOutside
                headerMode={"STATIC"}
                collapsed={false}
            />

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
