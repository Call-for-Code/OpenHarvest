import React, {useEffect, useState} from "react";
import * as ReactDOM from 'react-dom';
import {Grid, Column, Row, Slider, Button, TextInput} from "carbon-addons-iot-react";
import { CropTemplate, CropTemplateAPI} from "../../services/cropTemplate";

// instantiate API for interacting with mongoDB
const cropTemplateAPI = new CropTemplateAPI();

const rowStyle = {
    justifyContent:"center",
    alignItems:"center",
    paddingBottom:"1.5rem"
};

const columnStyle = {
    textAlign:"center",
}

const Farmers = () => {

    // state management
    const [addCropTemplateName, setAddCropTemplateName] = useState<string>();
    const [addWarncropTemplateName, setAddWarncropTemplateName] = useState(false);
    const [getCropTemplateName, setGetCropTemplateName] = useState<string>();
    const [getWarncropTemplateName, setGetWarncropTemplateName] = useState(false);
    const [deleteCropTemplateName, setDeleteCropTemplateName] = useState<string>();
    const [deleteWarncropTemplateName, setDeleteWarncropTemplateName] = useState(false);

    // submits cropTemplateName to delete its respective to CropTemplate document
    async function handleDelete(){
        if(deleteCropTemplateName){
            const res = await cropTemplateAPI.deleteCropTemplateByName(deleteCropTemplateName);
            console.log(res)
        }else{
            setDeleteWarncropTemplateName(true)
        }
        
    }
    
    // submits cropTemplateName to retrieve its respective to CropTemplate document
    async function handleGet(){
        if(getCropTemplateName){
            const res = await cropTemplateAPI.getCropTemplateByName(getCropTemplateName);
            console.log(res)
        }else{
            setGetWarncropTemplateName(true)
        }
        
    }

    // submits actionCropTemplatesObject add or update a CropTemplate document
    async function handlePut(){
        if(addCropTemplateName){
            
            const actionCropTemplatesObject : CropTemplate = {
                action_a_weight: parseInt(document.getElementById("action-A-input-for-slider")!.getAttribute('value')!),
                action_b_weight: parseInt(document.getElementById("action-B-input-for-slider")!.getAttribute('value')!),
                action_c_weight: parseInt(document.getElementById("action-C-input-for-slider")!.getAttribute('value')!),
                action_d_weight: parseInt(document.getElementById("action-D-input-for-slider")!.getAttribute('value')!),
                crop_template_id: addCropTemplateName
                }
            
            const res = await cropTemplateAPI.putCropTemplate(actionCropTemplatesObject);
            console.log(res)
            
        }else{
            setAddWarncropTemplateName(true)
        }
        
    }

    // update state for addCropTemplateName
    const handleAddCropTemplateNameChange = (event:any) => {
        setAddCropTemplateName(event.target.value)
    }

    // update state for getCropTemplateName
    const handleGetCropTemplateNameChange = (event:any) => {
        setGetCropTemplateName(event.target.value)
    }

    // update state for getCropTemplateName
    const handleDeleteCropTemplateNameChange = (event:any) => {
        setDeleteCropTemplateName(event.target.value)
    }

    return(
        <Grid>
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                    <p>s</p>
                </Column>
                <Column sm={3} md={3} lg={3} style={columnStyle}>
                    <p>CropTemplates</p>
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                    <p>Some  A</p>
                </Column>
                <Column sm={3} md={3} lg={3} style={columnStyle}>
                    <Slider
                        max={100}
                        min={0}
                        noValidate
                        value={25}
                        id="action-A"
                    />
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                    <p>Some  B</p>
                </Column>
                <Column sm={3} md={3} lg={3} style={columnStyle}>
                    <Slider
                        max={100}
                        min={0}
                        noValidate
                        value={25}
                        id="action-B"
                    />
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                    <p>Some  C</p>
                </Column>
                <Column sm={3} md={3} lg={3} style={columnStyle}>
                    <Slider
                        max={100}
                        min={0}
                        noValidate
                        value={25}
                        id="action-C"
                    />
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                    <p>Some  D</p>
                </Column>
                <Column sm={3} md={3} lg={3} style={columnStyle}>
                    <Slider
                    max={100}
                    min={0}
                    noValidate
                    value={25}
                    id="action-D"
                    />
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={3} md={3} lg={3}>
                    <TextInput labelText="" placeholder="Enter the Crop Template ID" id="cropTemplate_id" onChange={handleAddCropTemplateNameChange} warn={addWarncropTemplateName} warnText="cropTemplate ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button" style={{background: "green"}} onClick={handlePut}>Put</Button>
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={3} md={3} lg={3}>
                    <TextInput labelText="" placeholder="Find CropTemplates by Crop Template ID" id="cropTemplate_id" onChange={handleGetCropTemplateNameChange} warn={getWarncropTemplateName} warnText="cropTemplate ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button" onClick={handleGet}>Get</Button>
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={3} md={3} lg={3}>
                    <TextInput labelText="" placeholder="Delete CropTemplates by Crop Template ID" id="cropTemplate_id" onChange={handleDeleteCropTemplateNameChange} warn={deleteWarncropTemplateName} warnText="cropTemplate ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button"  style={{background: "red"}} onClick={handleDelete}>Delete</Button>
                </Column>
            </Row>
        </Grid>
    );
}
export default Farmers;