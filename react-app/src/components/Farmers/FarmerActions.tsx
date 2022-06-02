import React, {useEffect, useState} from "react";
import * as ReactDOM from 'react-dom';
import {Grid, Column, Row, Slider, Button, TextInput} from "carbon-addons-iot-react";
import { ActionWeights, getActionWeightsById, AddActionWeights ,addActionWeights} from "../../services/actionWeights";

const rowStyle = {
    justifyContent:"center",
    alignItems:"center",
    paddingBottom:"1.5rem"
};

const columnStyle = {
    textAlign:"center",
}

const FarmerActions = () => {

    const [fieldId, setFieldId] = useState();
    const [warnFieldId, setWarnFieldId] = useState(false);
    
    const handleFieldIdChange = (event: any) => {
        setFieldId(event.target.value)
    }

    const handleSubmit = () => {
        if(fieldId){
            alert(
                document.getElementById("action-A-input-for-slider")?.getAttribute('value') + " " +
                document.getElementById("action-B-input-for-slider")?.getAttribute('value') + " " +
                document.getElementById("action-C-input-for-slider")?.getAttribute('value') + " " +
                document.getElementById("action-D-input-for-slider")?.getAttribute('value') + " " +
                fieldId
            )
        }else{
            setWarnFieldId(true)
        }
        
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
                    <TextInput labelText="" placeholder="Enter the Field ID number" id="field_id" onChange={handleFieldIdChange} warn={warnFieldId} warnText="Field ID is required"/>
                </Column>
                <Column sm={2} md={2} lg={1}>
                    <Button type="button" onClick={handleSubmit}>Submit</Button>
                </Column>
            </Row>
        </Grid>
    );
}
export default FarmerActions;