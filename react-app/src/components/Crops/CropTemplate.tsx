import React, { useEffect, useState} from "react";
import { Column, Row, Select, SelectItem, SelectItemGroup, TextInput, Button, Slider} from "carbon-addons-iot-react";
import {Add16} from '@carbon/icons-react';
import { CropTemplate, CropTemplateAPI} from "../../services/cropTemplate";
import { CropService } from "../../services/CropService";
import { Crop } from "../../services/crops";
import { Field, SubField, SubFieldCrop} from "../../../../backend/src/db/entities/field"
import { UpdateSubFieldWithCropTemplate, OrganizeReputationActions, UpdateReputationActions } from './helperFunctions'

const cropTemplateAPI = new CropTemplateAPI();
const cropService = new CropService();

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

    // display state mangement
    const [actionRows, setActionRows] = useState<any>([]);
    const [cropTemplateName, setCropTemplateName] = useState<string>();
    const [emptyCropTemplateName, setEmptyCropTemplateName] = useState(false);
    
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
        }catch(error){
            setSelectedCropTemplate(event.target.value)
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

    async function handleSubmit(){
        //1. create cropTemplate
        // const res = await cropTemplateAPI.putCropTemplate(selectedCropTemplate);

        //2. search for existing Crop documents with selectedCrop._id and update to add cropTemplate object
        // const cropToUpdate: Crop = await cropService.getCrop(selectedCrop);
        // cropToUpdate.crop_template = selectedCropTemplate
        
        //should check to see if the crop already has an associated template first... but can add that later
        // const updatedCrop: Crop = await cropService.updateCrop(cropToUpdate);

        //3. search for existing Field.Subfield[] with Crop_id and update to add cropTemplate object
        // const fields: Field[] = await cropTemplateAPI.getFieldforCrop(selectedCrop);
        // UpdateSubFieldWithCropTemplate(fields, selectedCrop, selectedCropTemplate);


        // get all reputation Actions for a field and then put them in a list (usefull for front end display)
        // const res = await cropTemplateAPI.getActionsForField("62a36eb32307b1b4ef8db8d9");
        // OrganizeReputationActions(res)
        

        // updating reputation action values. A successful update should generate a payload for gnosis
        // const field: Field = await cropTemplateAPI.getActionsForField("62a36eb32307b1b4ef8db8d9");
        // const res = await cropTemplateAPI.putField(UpdateReputationActions(field, selectedCrop, "", "wasdf", true));



    }

    // update state for addCropTemplateName
    const handleCropTemplateNameChange = (event:any) => {
        setCropTemplateName(event.target.value)
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
                        <TextInput labelText="" placeholder="Enter the Crop Template ID" id="cropTemplate_id" onChange={handleCropTemplateNameChange} warn={emptyCropTemplateName} warnText="cropTemplate ID is required"/>
                    </Column>
                </Row>
                {
                    actionRows.map((actionRow: any) => {
                        return(
                            actionRow
                        );
                    })
                }
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