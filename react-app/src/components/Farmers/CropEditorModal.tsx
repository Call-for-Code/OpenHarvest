import { ComposedModal, ModalHeader, ModalBody, TextInput, ModalFooter, Button, InlineLoading, Select, SelectItem } from "carbon-components-react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "../../services/auth";
import { Crop } from "../../services/crops";
import { SubFieldCrop } from "../../types/EIS";
import { ICropService } from "../../services/CropService";
import commonInjectableContainer from "../../common/di/inversify.config";
import TYPES from "../../common/di/inversify.types";
import { dateToDateInputString } from "../../helpers/dateUtils";

export interface CropEditorModalProps {
    crop?: SubFieldCrop;
    open: boolean;
    setOpen: (openState: boolean) => void;
    finished: (crop: SubFieldCrop) => void;
}

export function CropEditorModal(props: PropsWithChildren<CropEditorModalProps>) {
    const {open, setOpen} = props;
    const isNew = props.crop == undefined;

    const auth = useAuth();
    const cropService: ICropService = commonInjectableContainer.get(TYPES.CropService);

    const [crops, setCrops] = useState<Crop[]>([]);
    
    // Form Data
    const [selectedCrop, setSelectedCrop] = useState(props.crop ? props.crop.crop : null);
    const [planted, setPlanted] = useState<Date | null>(props.crop ? props.crop.planted : null);
    const [harvested, setHarvested] = useState<Date | null>(props.crop ? props.crop.harvested : null);

    // Get the crops from the server
    useEffect(() => {
        // Thanks react
        async function load() {
            const crops = await cropService.findAll();
            setCrops(crops);
        }

        load()
    }, []);

    const isValid: () => boolean = () => {
        // if (planted == null) 
        //     return false;
        // if (selectedCrop == null)
        //     return false;
        return planted != null && selectedCrop != null;
    }

    function save() {
        const result = isValid();
        if (!result) {
            return;
        }
        setOpen(false);
        // make subfield or modify the initial one
        let farmerCrop: SubFieldCrop = {
            crop: selectedCrop!!,
            planted: planted!!,
            harvested: harvested,
            farmer: props.crop ? props.crop.farmer : ""
        }
        console.log("save", farmerCrop);
        props.finished(farmerCrop);
    }
    

    // return <div>Hello</div>
    return <ComposedModal
        open={open}
        onClose={() => {setOpen(false)}}>
            <ModalHeader label="Crop">
                <h1>
                    {isNew ? "Plant a Crop" :  "Edit Crop Information"}
                </h1>
            </ModalHeader>
            <ModalBody>
                <p style={{ marginBottom: '1rem' }}>
                    {isNew ? 
                        "Create a new Crop"
                        :
                        "Edit this Crop"}
                </p>
                <Select id="farmer-crop-select" labelText="Choose a Crop" onChange={(val) => setSelectedCrop(crops.find(it => it._id == val.target.value)!!)}>
                    <SelectItem disabled hidden value="placeholder-item" text="Choose a Crop" />
                {crops.map(it => 
                    <SelectItem value={it._id} text={it.name} />
                )}
                </Select>
                <div className="flex flex-row">
                    <TextInput
                        type="date"
                        id="crop-planted"
                        labelText="Date Planted"
                        invalid={planted == null}
                        invalidText="The Crop must be planted!"
                        value={dateToDateInputString(planted)}
                        onChange={(e) => setPlanted(e.target.value ? new Date(e.target.value) : null)}
                    />
                    <TextInput
                        type="date"
                        id="crop-planted"
                        labelText="Date Harvested"
                        value={dateToDateInputString(harvested)}
                        disabled={planted === null}
                        min={planted ? dateToDateInputString(planted) : undefined}
                        onChange={(e) => setHarvested(e.target.value ? new Date(e.target.value) : null)}
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    kind="secondary"
                    onClick={() => { setOpen(false); }}>
                    Cancel
                </Button>
                <Button
                    kind="primary"
                    disabled={!isValid()}
                    onClick={save}>
                    {isNew ? "Create" : "Update"}
                </Button>
                
            </ModalFooter>
        </ComposedModal>
}

