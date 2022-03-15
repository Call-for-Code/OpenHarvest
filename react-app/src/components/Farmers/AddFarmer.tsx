import React, { useEffect, useState } from "react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import produce from "immer"
import { FieldEditorMap } from "./../Map/FieldEditorMap";
import { Button, TextArea, TextInput } from "carbon-components-react";
import { EISField, SubFieldCrop } from "../../types/EIS";
import { area } from "@turf/turf";
import { Sprout16, Wheat16, Add16 } from "@carbon/icons-react";
import { CropEditorModal } from "./CropEditorModal";


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
      onApplyBatchAction: (actionId: string, rowIds: string[]) => {},
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
        name: 'Field Name',
    },
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
    hasRowNesting: true,
    hasRowActions: true
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
    const [fieldTableData, setFieldTableData] = useState<any>([]);

    // Crop data
    const [isCropEditorModalOpen, setIsCropEditorModalOpen] = useState(false);
    const [currentCropEditorRow, setCurrentCropEditorRow] = useState<number | null>(null);

    actions.toolbar.onApplyBatchAction = (actionId: string, rowIds: string[]) => {
        console.log(actionId, rowIds);
        if (actionId == "harvest") {
            // Filter on the crop only rows and harvest them now
            const crops = rowIds.filter(it => it.includes("crop"));
            crops.forEach(it => {
                const splitRowId = it.split("-");
                const fieldIdx = parseInt(splitRowId[2]);
                const cropIdx = parseInt(splitRowId[5]);

                setField(produce(draftField => {
                    const subfieldOpenHarvestProperties = draftField!!.subFields[fieldIdx].geo.geojson.features[0].properties.open_harvest;
                    subfieldOpenHarvestProperties.crops[cropIdx].harvested = new Date();
                }));
            });
        }
    };
    actions.table.onApplyRowAction = (actionId: string, rowId: string) => {
        console.log(actionId, rowId);
        if (actionId == "addCrop") {
            const idx = parseInt(rowId.split("-")[2]);
            setCurrentCropEditorRow(idx);
            setIsCropEditorModalOpen(true);
        }
        else if (actionId == "harvestOneCrop") {
            const splitRowId = rowId.split("-");
            const fieldIdx = parseInt(splitRowId[2]);
            const cropIdx = parseInt(splitRowId[5]);

            setField(produce(draftField => {
                const subfieldOpenHarvestProperties = draftField!!.subFields[fieldIdx].geo.geojson.features[0].properties.open_harvest;
                subfieldOpenHarvestProperties.crops[cropIdx].harvested = new Date();
            }));
        }
    };

    const onFieldUpdated = (field: EISField) => {
        setField(_ => field);
    }

    const onCropEditorModalClosed = (crop: SubFieldCrop) => {
        const idx = currentCropEditorRow;
        if (idx == null) {
            throw new Error("currentCropEditorRow is null!");
        }
        if (field == null) {
            throw new Error("field is null!");
        }
        setField(produce(draftField => {
            const subfieldOpenHarvestProperties = draftField!!.subFields[idx].geo.geojson.features[0].properties.open_harvest;
            subfieldOpenHarvestProperties.crops.push(crop);
        }));        
    }

    useEffect(() => {
        console.log("Field Updated", field);

        if (field) {
            const tableData = field.subFields.map((it, i) => {
                const feature = it.geo.geojson.features[0];
                const crops: SubFieldCrop[] = feature.properties.open_harvest.crops;
                const doesCropDataExist = crops.length > 0;

                const sqm = squareMetresToHa(area(feature));
                const cropYield = sqm * 100;

                const children = !doesCropDataExist ? [] : crops.map((it, index) => {
                    return {
                        id: `subfield-id-${i}-crop-id-${index}`,
                        values: {
                            name: field.name,
                            area: sqm.toFixed(0),
                            crop: it.crop.name,
                            planted: it.planted.toLocaleDateString(),
                            harvested: it.harvested ? it.harvested.toLocaleDateString() : "--",
                            yield: cropYield.toFixed(2) + " Kg",
                        },
                        rowActions: [{
                            id: 'harvestOneCrop',
                            renderIcon: Wheat16,
                            iconDescription: 'Harvest',
                            labelText: 'Harvest'
                        }]
                    }
                })
                console.log(children);

                return {
                    id: `subfield-id-${i}`,
                    values: {
                        name: field.name,
                        area: sqm.toFixed(0),
                        crop: doesCropDataExist ? crops[0].crop.name : "None",
                        planted: doesCropDataExist ? crops[0].planted.toLocaleDateString() : "",
                        harvested: doesCropDataExist ? (crops[0].harvested ? crops[0].harvested.toLocaleDateString() : "") : "", // yikes
                        yield: cropYield.toFixed(2) + " Kg",
                    },
                    children,
                    rowActions: [{
                        id: 'addCrop',
                        renderIcon: Add16,
                        iconDescription: 'Plant a Crop',
                        labelText: 'Plant a Crop'
                    }]
                }
            });
            setFieldTableData(tableData);
        }

    }, [field]);

    function saveFarmer() {
        
    }

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
                <FieldEditorMap onFieldUpdated={onFieldUpdated} existingField={field ? field : undefined}></FieldEditorMap>
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
                    <div className="flex justify-end mt-5 pr-5">
                        <Button
                            kind="primary"
                        >
                            Save
                        </Button>
                    </div>
                    
                </div>
                <CropEditorModal 
                    open={isCropEditorModalOpen}
                    setOpen={setIsCropEditorModalOpen}
                    finished={onCropEditorModalClosed}
                />
            </div>
        </div>
    </>;
}