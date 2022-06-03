import React, {useEffect, useState} from "react";
import * as ReactDOM from 'react-dom';
import {Grid, Column, Row, Slider, Button, TextInput} from "carbon-addons-iot-react";
import { ActionWeights, ActionWeightsAPI} from "../../services/actionWeights";

// instantiate API for interacting with mongoDB
const actionWeightsAPI = new ActionWeightsAPI();

const rowStyle = {
    justifyContent:"center",
    alignItems:"center",
    paddingBottom:"1.5rem"
};

const columnStyle = {
    textAlign:"center",
}

const FarmerActions = () => {

    // state management
    const [addCropTemplateId, setAddCropTemplateId] = useState<string>();
    const [addWarncropTemplateId, setAddWarncropTemplateId] = useState(false);
    const [getCropTemplateId, setGetCropTemplateId] = useState<string>();
    const [getWarncropTemplateId, setGetWarncropTemplateId] = useState(false);
    const [deleteCropTemplateId, setDeleteCropTemplateId] = useState<string>();
    const [deleteWarncropTemplateId, setDeleteWarncropTemplateId] = useState(false);

    async function handleSubmitDeleteActionWeightsById(){
        if(deleteCropTemplateId){
            const res = await actionWeightsAPI.deleteActionWeightsById(deleteCropTemplateId);
            console.log(res)
        }else{
            setDeleteWarncropTemplateId(true)
        }
        
    }
    
    async function handleSubmitGetActionWeightsById(){
        if(getCropTemplateId){
            const res = await actionWeightsAPI.getActionWeightsById(getCropTemplateId);
            console.log(res)
        }else{
            setGetWarncropTemplateId(true)
        }
        
    }

    // submits actionWeightsObject to ActionWeights creation API
    async function handleSubmit(){
        if(addCropTemplateId){
            
            const actionWeightsObject : ActionWeights = {
                action_a_weight: parseInt(document.getElementById("action-A-input-for-slider")!.getAttribute('value')!),
                action_b_weight: parseInt(document.getElementById("action-B-input-for-slider")!.getAttribute('value')!),
                action_c_weight: parseInt(document.getElementById("action-C-input-for-slider")!.getAttribute('value')!),
                action_d_weight: parseInt(document.getElementById("action-D-input-for-slider")!.getAttribute('value')!),
                crop_template_id: addCropTemplateId
                }
            
            const res = await actionWeightsAPI.putActionWeights(actionWeightsObject);
            console.log(res)
            
        }else{
            setAddWarncropTemplateId(true)
        }
        
    }

    // update state for addCropTemplateId
    const handleAddCropTemplateIdChange = (event:any) => {
        setAddCropTemplateId(event.target.value)
    }

    // update state for getCropTemplateId
    const handleGetCropTemplateIdChange = (event:any) => {
        setGetCropTemplateId(event.target.value)
    }

    // update state for getCropTemplateId
    const handleDeleteCropTemplateIdChange = (event:any) => {
        setDeleteCropTemplateId(event.target.value)
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
            <Row style={rowStyle}>
                <Column sm={2} md={2} lg={2} style={columnStyle}>
                    <p>Some Action A</p>
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
                    <p>Some Action B</p>
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
                    <p>Some Action C</p>
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
                    <p>Some Action D</p>
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
                    <TextInput labelText="" placeholder="Enter the Crop Template ID" id="cropTemplate_id" onChange={handleAddCropTemplateIdChange} warn={addWarncropTemplateId} warnText="cropTemplate ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button" style={{background: "green"}} onClick={handleSubmit}>Submit</Button>
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={3} md={3} lg={3}>
                    <TextInput labelText="" placeholder="Find ActionWeights by Crop Template ID" id="cropTemplate_id" onChange={handleGetCropTemplateIdChange} warn={getWarncropTemplateId} warnText="cropTemplate ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button" onClick={handleSubmitGetActionWeightsById}>Submit</Button>
                </Column>
            </Row>
            <Row style={rowStyle}>
                <Column sm={3} md={3} lg={3}>
                    <TextInput labelText="" placeholder="Delete ActionWeights by Crop Template ID" id="cropTemplate_id" onChange={handleDeleteCropTemplateIdChange} warn={deleteWarncropTemplateId} warnText="cropTemplate ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button"  style={{background: "red"}} onClick={handleSubmitDeleteActionWeightsById}>Submit</Button>
                </Column>
            </Row>
        </Grid>
    );
}
export default FarmerActions;