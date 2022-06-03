import React, {useEffect, useState} from "react";
import * as ReactDOM from 'react-dom';
import { PageTitleBar, Grid, Column, Row, RadioButton, RadioButtonGroup, Select, SelectItem, TextInput, Button, ComposedModal} from "carbon-addons-iot-react";
import {Information16} from '@carbon/icons-react';
import {BusinessEvents, UnitsOfMeasure, EventTypeModalText, PackingIDModalText, AssetIdModalText} from './FoodTrustHelperData';
import { FoodTrustAPI } from "../../services/food-trust";
import FarmerActions from "../Farmers/CropTemplate"

const foodTrustAPI = new FoodTrustAPI()

const rowStyle = {
    justifyContent:"center",
    paddingBottom:"1.5rem"
};

const capitalize = (text: string) => {
    let words = text.split("_");
    let output = "";
    words.map(function(wordFound: String){
        output += wordFound.charAt(0).toUpperCase() + wordFound.slice(1) + " "
    })
    return output;
}

const TransactionLookUp = () => {
    const [eventBody, setEventBody] = useState([]);
    const [assetId, setAssetId] = useState("");

    const handleSubmit = () => {
        foodTrustAPI.foodTrustGetEventByAssetId(assetId).then(function(data){
            setEventBody(data.events)
         })
    }

    const handleAssetIdChange = (event: any) => {
        setAssetId(event.target.value)
    }    
    
    return(
        <>
            <TextInput labelText={<label>Event Type<ModalFactory displayText={AssetIdModalText}/></label>} disabled={false} onChange={handleAssetIdChange}/>
            <Button type="button" style = {{float:"right"}} onClick={() => handleSubmit()}>Lookup Event</Button>
            {
                eventBody.map((event: any) => {
                    return(
                        <>
                            <p>Event Data for Asset Id {assetId}:</p>
                            <p>Event Type:  {event.event_type}</p>
                            <p>Event Time:  {event.event_time}</p>
                            <p>Business Location:  {event.biz_location_id}</p>
                            {
                                event.quantities.map((item: any) => {
                                    return(
                                        <>
                                        <p>EPC ID: {item.epc_id}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Unit of Measure: {item.uom}</p>
                                    </>
                                    )
                                })
                            }
                        </>
                    )
                })
            }
        </>
    )
}

const ModalFactory = (props: any) => {
    const [open, setOpen] = useState(false);
    return(
        <>
            {
                typeof document === 'undefined'
                ? null
                : ReactDOM.createPortal(
                    <ComposedModal open={open} onClose={() => setOpen(false)} passiveModal={true}>
                       {props.displayText}
                    </ComposedModal>,
                    document.body
                )
            }
            <Button kind="ghost"renderIcon={Information16} iconDescription="Icon Description" hasIconOnly={true} style={{padding: "0",minHeight:"0"}} onClick={() => setOpen(true)} />
        </>
    )
}

const updateEventType = (businessEvent: string, packageIdType: string) => {
    let eventType = "";

    switch(businessEvent){
        case "urn:epcglobal:cbv:bizstep:commissioning":
            eventType = "COMMISSION"
            break;
        case "https://epcis.heifer.com/bizStep/transport_to_retailer":
            if(packageIdType !== "lot"){
                eventType = "AGGREGATION"    
            }else{
                eventType = "TRANSFORMATION"    
            }
            
            break;
        default:
            eventType = "OBSERVATION"
            break;
    }
    return eventType;
}

const SelectFactory = (props: any) => {

    const handleChange = (event: any) => { 

        if(event.target.id === "businessEvent"){
            const eventType = updateEventType(event.target.value, props.paramMap.packingIdType)
            props.paramMap.eventType = eventType
            props.setEventTypeState(eventType)
        }

        props.paramMap[event.target.id] = event.target.value
        props.setParamMap(props.paramMap)
    }

    return (
        <Select labelText={props.labelText} id={props.id} defaultValue="placeholder-item" disabled={props.disabled} onChange={handleChange}>
            <SelectItem disabled hidden value="placeholder-item" text={props.selectItemText}/>
            {
                props.itemMap.map(function(item: any){
                        return (
                            <SelectItem key={item[props.mapValue]} value={item[props.mapValue]} text={capitalize(item[props.mapText])} />
                        )
                    })
            }
        </Select>
    )
}

const MainForm = (props: any) => {
    const [disableMeasure, setDisableMeasure] = useState(false)
    const [eventTypeState, setEventTypeState] = useState(props.paramMap.eventType)

    const handlePackingIdNumberChange = (event:any) => {
        props.paramMap["packingIdNumber"] = event.target.value;
        props.setParamMap(props.paramMap)
    }

    const handleQuantityChange = (event: any) =>  {
        props.paramMap["quantity"] = event.target.value;
        props.setParamMap(props.paramMap)
    }
    const handlePackingIdChange = (event: any) => {
        if(event.target.value !== "lot"){
            setDisableMeasure(true)
            props.paramMap.unitsOfMeasure = "";
        }else{
            setDisableMeasure(false)            
        }
        setEventTypeState(updateEventType(props.paramMap.businessEvent, event.target.value))
        props.paramMap["packingIdType"] = event.target.value;
        props.setParamMap(props.paramMap)
    }
    return (
        <>
        <Row style={rowStyle}>
            <Column sm={10} md={5} lg={5}>
                <SelectFactory labelText="BusinessEvent" selectItemText="Choose Business Event Type" itemMap={BusinessEvents} mapKey="name" mapValue="value" mapText="name" disabled={false} setEventTypeState={setEventTypeState} setParamMap={props.setParamMap} paramMap={props.paramMap} id={"businessEvent"}/>
            </Column>
            <Column sm={10} md={5} lg={5}>
                <TextInput labelText={<label>Event Type<ModalFactory displayText={EventTypeModalText}/></label>} disabled={false} value={eventTypeState}/>
            </Column>
        </Row>
        <Row style={rowStyle}>
            <Column sm={10} md={3} lg={3}>
                <TextInput labelText="Packing ID" placeholder="Enter the packing ID number" onChange={handlePackingIdNumberChange} id="optional-label"/>
            </Column>
            <Column sm={10} md={3} lg={3}>
                <TextInput labelText="Quantity" placeholder="Enter the quantity" onChange={handleQuantityChange} id="optional-label"/>
            </Column>
            <Column sm={10} md={4} lg={4}>
                <SelectFactory labelText="Business Location" selectItemText="Select Location" itemMap={props.locations} mapKey="id" mapValue="id" mapText="party_name" disabled={false} setParamMap={props.setParamMap} paramMap={props.paramMap} id={"businessLocation"}/>
            </Column>
        </Row>
        <Row style={rowStyle}>
            <Column sm={4} md={3} lg={3}>
                <SelectFactory labelText="Product Name" selectItemText="Select Product" itemMap={props.products} mapKey="id" mapValue="id" mapText="description" disabled={false} setParamMap={props.setParamMap} paramMap={props.paramMap} id={"product"}/>
            </Column>
            <Column sm={2} md={3} lg={3}>
                <RadioButtonGroup  name="radio-button-group" defaultSelected="lot" legendText={<label>Packing ID Type<ModalFactory displayText={PackingIDModalText}/></label>}>
                    <RadioButton value="lot" id="radio-1" labelText="Lot" onClick={handlePackingIdChange}/>
                    <RadioButton value="serial" labelText="Serial" id="radio-2" onClick={handlePackingIdChange}/>
                    <RadioButton value="pallet" labelText="Pallet" id="radio-3" onClick={handlePackingIdChange}/>
                </RadioButtonGroup>
            </Column>
            <Column sm={4} md={4} lg={4}>
                <SelectFactory labelText="Units of Measure" selectItemText="Select Unit" itemMap={UnitsOfMeasure} mapKey={"name"} mapValue={"value"} mapText="name" disabled={disableMeasure} setParamMap={props.setParamMap} paramMap={props.paramMap} id={"unitsOfMeasure"}/>
            </Column>
        </Row>
        </>
    )
}

const DisplayResponse = (props: any) => {
    return (
        props.responseMap.ids.map(function(item: any){
            return(
                <p key={item}>{item}</p>
            )
        })
    )
}

const FoodTrust = () => {

    function handleSubmit(){
        foodTrustAPI.foodTrustTransaction(paramMap).then(function(data){
            const responseMap = {
                ids: data.message.ids,
                warnings: data.message.warnings
            }
            setResponse(responseMap)
        })
    }

    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [paramMap, setParamMap] = useState({
            businessEvent:"",
            eventType:"Select a business event!",
            quantity:"",
            businessLocation:"",
            product:"",
            packingIdNumber:"",
            packingIdType:"lot",
            unitsOfMeasure:"",
    });
    const [response, setResponse] = useState({ids: [], warnings:[]})

    useEffect(()=>{
            foodTrustAPI.foodTrustProductByDesciption().then(function(data){
                setProducts(data.products)
             })

             foodTrustAPI.foodTrustLocationByOrg().then(function(data){
                setLocations(data.locations)
             })
    },[])

    return (
        <>
            <PageTitleBar title={"FoodTrust"} forceContentOutside headerMode={"STATIC"} collapsed={false}/>
            <Grid>
                <MainForm products={products} locations={locations} setParamMap={setParamMap} paramMap={paramMap}/>
                <Row style={rowStyle}>
                    <Column sm={10} md={10} lg={10}>
                        <Button type="button" style = {{float:"right"}} onClick={() => handleSubmit()}>Submit Event</Button>
                    </Column>
                </Row>
                <Row style={rowStyle}>
                    <Column sm={10} md={10} lg={10}>
                        <DisplayResponse responseMap={response} />
                    </Column>
                </Row>
                <Row style={rowStyle}>
                    <Column sm={10} md={10} lg={10}>
                        <TransactionLookUp/>
                    </Column>
                </Row>
            </Grid>
            <FarmerActions/>
        </>
    );
}

export default FoodTrust;