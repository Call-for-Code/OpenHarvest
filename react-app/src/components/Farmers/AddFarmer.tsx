import React, { useEffect, useState } from "react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { FieldEditorMap } from "./../Map/FieldEditorMap";
import { TextArea, TextInput } from "carbon-components-react";
import { FeatureCollection, Polygon } from "geojson";
import { EISField } from "../../types/EIS";
import { area } from "@turf/turf";
import { Sprout16, Wheat16 } from "@carbon/icons-react";


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
      onApplyBatchAction: (actionId: string, rowIds: string[]) => {console.log(actionId, rowIds)},
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
        id: 'area',
        name: 'Area (Ha)',
    },
    {
        id: 'crop',
        name: 'Current Crop',
    },
    {
        id: 'planted',
        name: 'Planted Date',
    },
    {
        id: 'harvested',
        name: 'Harvested Date',
    },
    {
        id: 'yield',
        name: '(Expected) Yield',
    }
]

const options = {
    hasRowSelection: 'multi',
    hasSearch: false,
    hasRowNesting: true
}

const view = {
    toolbar: {
        batchActions: [
            {
                iconDescription: 'Plant a Crop',
                id: 'plant',
                labelText: 'Plant',
                renderIcon: Sprout16
            },
            {
                iconDescription: 'Harvest',
                id: 'harvest',
                labelText: 'Harvest',
                renderIcon: Wheat16
            }
        ]
    }
}

function squareMetresToHa(sqm: number) {
    return sqm / 1000;
}

export function AddFarmer() {

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    // There can only really be one org
    const [coopOrgs, setCoopOrgs] = useState("");
    const [field, setField] = useState<EISField | null>(null);
    const [fieldTableData, setFieldTableData] = useState<any>([])

    const onFieldUpdated = (field: EISField) => {
        setField(_ => field);
    }

    useEffect(() => {
        console.log("Field Updated", field);

        if (field) {
            const tableData = field.subFields.map((it, i) => {
                const feature = it.geo.geojson.features[0];
                const crops = feature.properties.open_harvest.crops;
                const doesCropDataExist = crops.length > 0;

                const sqm = squareMetresToHa(area(feature));
                const cropYield = sqm * 100;
                return {
                    id: `row-id-${i}`,
                    values: {
                        area: sqm.toFixed(0),
                        crop: doesCropDataExist ? crops[0].crop.name : "None",
                        planted: doesCropDataExist ? crops[0].planted : "",
                        harvested: doesCropDataExist ? crops[0].harvested : "",
                        yield: cropYield.toFixed(2) + " Kg",
                    },
                    children: [

                    ]
                }
            });
            setFieldTableData(tableData);
        }

    }, [field])

    return <>
        <PageTitleBar
            title={"Add a Farmer"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />
        {/* // Content container */}
        <div className="w-full h-[calc(100vh-96px)] flex flex-row">
            <div className="w-1/2">
                <FieldEditorMap onFieldUpdated={onFieldUpdated}></FieldEditorMap>
            </div>
            <div className="w-1/2 space-y-10">
                <div className="flex flex-row">
                    <TextInput
                        type="text"
                        id="name"
                        labelText="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextInput
                        type="text"
                        id="mobile"
                        labelText="Mobile Number"
                        helperText="Include a country code"
                        placeholder="+61459756125"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                </div>
                
                <TextArea
                    id="address"
                    labelText="Address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <h2>Fields</h2>
                <div>
                    <StatefulTable
                        id="table"
                        columns={columns}
                        data={fieldTableData}
                        view={view}
                        actions={actions}
                        options={options}
                    />
                </div>
                
            </div>
        </div>
    </>;
}