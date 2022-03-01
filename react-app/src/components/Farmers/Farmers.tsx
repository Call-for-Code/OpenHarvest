import React, { Component, ReactElement, useEffect, useState } from "react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { Farmer, getAllFarmers } from "../../services/farmers";
import { Button } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

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
        customToolbarContent: (
            <Button
              kind="primary"
              iconDescription="Add Farmer"
              onClick={() => console.log(true)}
            >
                Add
            </Button>
          )
    }
}

const options = {
    hasRowSelection: 'single',

}

export default function Farmers() {

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
                        fieldsLen: it.land_ids.length
                    }
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
                options={options}
                hasSearch
                 />
        </div>

        

}
