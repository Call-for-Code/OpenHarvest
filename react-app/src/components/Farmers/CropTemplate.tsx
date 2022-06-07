import React, {useEffect, useState} from "react";
import * as ReactDOM from 'react-dom';
import {Grid, Column, Row, Slider, Button, TextInput} from "carbon-addons-iot-react";
import { CropTemplate, CropTemplateAPI} from "../../services/cropTemplate";
import {Add16} from '@carbon/icons-react';
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
    
    const [actionRows, setActionRows] = useState<any>([]);

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
            const action_weights: Record<string, string> = {};
            for(let x = 0; x < actionRows.length; x++){
                action_weights[(document.getElementById("action-name-" + x) as HTMLInputElement).value] = document.getElementById("action-value-" + x)!.getAttribute('aria-valuenow')!
            }

            const actionCropTemplatesObject : CropTemplate = {
                "action_weights": action_weights,
                "crop_template_name" : addCropTemplateName
            }
            const res = await cropTemplateAPI.putCropTemplate(actionCropTemplatesObject);
            
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

    useEffect(()=>{
       if(!actionRows.length){
        handleNewActionRow()
        }
    },[])

    function handleNewActionRow(){
        actionRows.push(
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                <TextInput labelText="" placeholder="Your Action's Name" id={"action-name-" + actionRows.length}/>
                </Column>
                <Column sm={3} md={3} lg={3} style={columnStyle}>
                    <Slider
                        max={100}
                        min={0}
                        noValidate
                        value={25}
                        id={"action-value-" + actionRows.length}
                    />
                </Column>
                <Column sm={1} md={1} lg={1} style={columnStyle}>
                    <Button hasIconOnly iconDescription="Add Another Action and Weight" renderIcon={Add16} onClick={handleNewActionRow}/>
                </Column>
            </Row>
        );
        setActionRows([...actionRows])
    }

    return(
        <Grid>
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                    <p>Actions</p>
                </Column>
                <Column sm={3} md={3} lg={3} style={columnStyle}>
                    <p>Weights</p>
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
                <Column sm={3} md={3} lg={3}>
                    <TextInput labelText="" placeholder="Enter the Crop Template ID" id="cropTemplate_id" onChange={handleAddCropTemplateNameChange} warn={addWarncropTemplateName} warnText="cropTemplate ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button" style={{background: "green"}} onClick={handlePut}>Add</Button>
                </Column>
            </Row>
            {/* <Row style={rowStyle}>
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
            </Row> */}
        </Grid>
    );
}
export default Farmers;