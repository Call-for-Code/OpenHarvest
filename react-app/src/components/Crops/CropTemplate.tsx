import React, { useEffect, useState} from "react";
import { Column, Row, Select, SelectItem, SelectItemGroup, TextInput, Button, Slider, NumberInput} from "carbon-addons-iot-react";
import {Add16} from '@carbon/icons-react';
import { CropTemplate, CropTemplateAPI} from "../../services/cropTemplate";
import { CropService } from "../../services/CropService";
import { Crop } from "../../services/crops";
import { getFarmer, Farmer } from "../../services/farmers";
import { Field, SubField, SubFieldCrop} from "../../../../backend/src/db/entities/field"
import { UpdateSubFieldWithCropTemplate, OrganizeReputationActions } from './helperFunctions';
import { ColonyAPI } from '../../services/colony';

const cropTemplateAPI = new CropTemplateAPI();
const cropService = new CropService();
const colonyService = new ColonyAPI();

const rowStyle = {
    // justifyContent:"center",
    alignItems:"center",
    paddingTop: ".75vh"
    // paddingBottom:"1.5rem"
};

const columnStyle = {
    textAlign:"center",
}

const CropTemplateSelector = () => {
    let templateForSubmission: any;

    // display state mangement
    const [actionRows, setActionRows] = useState<any>([]);
    const [cropTemplateName, setCropTemplateName] = useState<string>();
    const [cropTemplatePayout, setCropTemplatePayout] = useState<number>(1);
    const [emptyCropTemplateName, setEmptyCropTemplateName] = useState(false);
    const [emptyCropTemplatePayout, setEmptyCropTemplatePayout] = useState(false);
    
    // mongodb object state management
    const [crops, setCrops] = useState<any>([]);
    const [selectedCrop, setSelectedCrop] = useState<any>("select-crop");
    const [cropTemplates, setCropTemplates] = useState<any>([]);
    const [selectedCropTemplate, setSelectedCropTemplate] = useState<any>("select-template");

    // upon rendering component...
    useEffect(() => {
        if(!actionRows.length){
            handleNewActionRow()
        }
        if(!crops.length){
            cropService.findAll().then(function(data){
                setCrops(data)
            })
        }
        cropTemplateAPI.getAllCropTemplates().then(function(data){
            setCropTemplates(data)
        });
    },[selectedCropTemplate]);


    // handler functions
    const handleCropSelection = (event:any) => {
        setSelectedCrop(event.target.value);
    }
    
    const handleTemplateSelection = (event: any) => {
        try{
            const cropTemplateEvent: CropTemplate = JSON.parse(event.target.value);
            setSelectedCropTemplate(cropTemplateEvent)
            console.log(cropTemplateEvent)
        }catch(error){
            setSelectedCropTemplate(event.target.value)
            console.log(event.target.value)
        }
    }

    function handleNewActionRow(){
        actionRows.push(
            <Row style={rowStyle}>
                <Column>
                    <TextInput labelText="" placeholder="Your Action's Name" id={"action-name-" + actionRows.length}/>
                </Column>
                <Column>
                    <Slider
                        max={100}
                        min={0}
                        noValidate
                        value={25}
                        id={"action-value-" + actionRows.length}
                    />
                </Column>
                <Column style={columnStyle}>
                    <Button hasIconOnly iconDescription="Add Another Action and Weight" renderIcon={Add16} onClick={handleNewActionRow}/>
                </Column>
            </Row>
        );
        setActionRows([...actionRows])
    }

    const buildCropTemplate = () => {
        if(cropTemplateName && cropTemplatePayout){
            const action_weights: Record<string, string> = {};
            
            for(let x = 0; x < actionRows.length; x++){
                action_weights[(document.getElementById("action-name-" + x) as HTMLInputElement).value] = document.getElementById("action-value-" + x)!.getAttribute('aria-valuenow')!
            }

            const actionCropTemplatesObject : CropTemplate = {
                action_weights: action_weights,
                crop_template_name : cropTemplateName,
                max_payout : cropTemplatePayout
            }
            
            templateForSubmission = actionCropTemplatesObject

        }else{
            if(!cropTemplateName){ setEmptyCropTemplateName(true); }

            if(!cropTemplatePayout){ setEmptyCropTemplatePayout(true); }
        }
    }

    async function handleSubmit(){
        if(selectedCropTemplate === "new-crop-template"){
            buildCropTemplate();
            //1. create cropTemplate
            await cropTemplateAPI.putCropTemplate(templateForSubmission);
        }else{
            templateForSubmission = selectedCropTemplate;
        }

        // ******** adding croptemplate to crop and fields ********
        //1. add cropTemplate to Crop: search for existing Crop documents with selectedCrop._id and update to add cropTemplate object
        const cropToUpdate: Crop = await cropService.getCrop(selectedCrop);
        cropToUpdate.crop_template = templateForSubmission;
        await cropService.updateCrop(cropToUpdate); //should check to see if the crop already has an associated template first... but can add that later
        // 2. add cropTemplate and rep actions to fields: search for existing Field.Subfield[] with Crop_id and update to add cropTemplate object
        const fields: Field[] = await cropTemplateAPI.getFieldsforCropId(selectedCrop);
        UpdateSubFieldWithCropTemplate(fields, cropTemplateAPI, selectedCrop, templateForSubmission);

        // ******** UI display ********

        //get all reputation Actions for a field and then put them in a list (usefull for front end display)
        // const res = await cropTemplateAPI.getField("62bdf886ff4ab905c24225a6");
        // console.log(OrganizeReputationActions(res))
        
        // ******** updating reputation action ********

        // 1. get actions by providing a field
        // 2. apply updates to fields 
        // 3. Get the farmer ID associated with the reputation actions
        // 4. Use the OpenHarvest's ethKeyID to instantiate a new AWSSigner with OpenHarvest's ethereum Address
        // 5. Use the farmer's ethKeyID to instantiate a new AWSSigner with the famer's ethereum Address
        // 6. Calculate the payout amount and send from OpenHarvest address using colony SDK's pay() function
        // const field: Field = await cropTemplateAPI.getField("62c87e05e468c7b44ad4af96");
        // await cropTemplateAPI.updateRepActions(field, selectedCrop, "", "MyAction", true);        
        
        // ******** get reputation data for farmer object ********
        //await colonyService.getReputationForFarmer(field);
        
    }

    // update state for addCropTemplateName
    const handleCropTemplateNameChange = (event:any) => {
        setCropTemplateName(event.target.value)
    }

    // update state for addCropTemplateName
    const handleCropTemplatePayoutChange = (event:any) => {
        setCropTemplatePayout(event.target.value)
    }

    return(
        <>
            <Row>
                <Column>
                    <Select
                        defaultValue="select-crop"
                        helperText=""
                        id="select-1"
                        labelText="Crop"
                        size="md"
                        onChange={handleCropSelection}
                        >
                        <SelectItem
                            disabled
                            hidden
                            text="Select Crop"
                            value="select-crop"
                        />
                        <SelectItemGroup label="Legumes"> {/*The categories can be stored and pulled from mongodb in a later release...*/}
                            {
                                crops.map((item: Crop) => {
                                    return(
                                        <SelectItem
                                            text={item.name}
                                            value={item._id}
                                        />
                                    )
                                })
                            }
                        </SelectItemGroup>
                    </Select>
                </Column>
            </Row>
            <Row>
                <Column>
                    <Select
                        defaultValue="select-template"
                        helperText=""
                        id="select-1"
                        labelText="Crop Template"
                        size="md"
                        onChange={handleTemplateSelection}
                        >
                        <SelectItem
                            disabled
                            hidden
                            text="Select Crop Template"
                            value="select-template"
                        />
                        <SelectItem
                            // disabled
                            // hidden
                            text="New Template"
                            value="new-crop-template"
                        />
                        {
                            cropTemplates.map((item:CropTemplate) => {
                                return(
                                    <SelectItem
                                        text={item.crop_template_name}
                                        value={JSON.stringify(item)}
                                    />
                                )
                            })
                        }
                    </Select>
                </Column>
            </Row>
            {
                (selectedCropTemplate === "new-crop-template") && 
                <>
                <Row style={rowStyle}>
                    <Column>
                        <TextInput labelText="" placeholder="Enter the Crop Template ID" id="cropTemplate_id" onChange={handleCropTemplateNameChange} warn={emptyCropTemplateName} warnText="CropTemplate ID is required"/>
                    </Column>
                </Row>
                {
                    actionRows.map((actionRow: any) => {
                        return(
                            actionRow
                        );
                    })
                }
                 <Row style={rowStyle}>
                    <Column>
                        <NumberInput
                            helperText="Max reputation payout."
                            id="cropTemplate_payout"
                            invalidText="Max payout must be between 1 and 10"
                            label=""
                            max={10}
                            min={cropTemplatePayout}
                            size="md"
                            onChange={handleCropTemplatePayoutChange}
                            warn={emptyCropTemplatePayout}
                            warnText="CropTemplate payout is required"
                            />
                    </Column>
                </Row>
                </>           
            }
            <Row>
                <Column>
                    <Button type="button" style={{background: "green"}} onClick={handleSubmit}>Create New Template</Button>
                </Column>
            </Row> 
        </>
    )
}

export default CropTemplateSelector;