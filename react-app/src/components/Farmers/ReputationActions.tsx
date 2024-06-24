import React, { useEffect, useState } from "react";
import { Field } from "../../types/field";
import { Farmer, getAllFarmers } from "../../services/farmers";
import { Column, Row, Select, SelectItem, Toggle } from "carbon-addons-iot-react";
import { FieldAPI } from "../../services/fields";
import { CropTemplateAPI } from "../../services/cropTemplate"
import { OrganizeReputationActions } from '../Crops/helperFunctions';

const fieldAPI = new FieldAPI();
const cropTemplateAPI = new CropTemplateAPI();
const ReputationActions = (props: any) => {
    const [field, setField] = useState<Field>();
    const [farmer, setFarmer] = useState<string>();
    const [farmerList, setFarmerList] = useState<Farmer[]>([]);
    const [reputationActionMap, setReputationActionMap] = useState<any>({});

    const handleClick = async(key: string) => {
        
        const response = await cropTemplateAPI.updateRepActions(field, props.selectedCrop, farmer!, key, true);
        if(response.status === 200){
            let newReputationActionMap = [...reputationActionMap];
            newReputationActionMap[0][key] = true;
            setReputationActionMap(newReputationActionMap);
        }
    }
    
    const getValueMap = (actionMap: any) => {
        // console.log('actionMap: ', actionMap);
        let actions = []
        for(let key in actionMap[0]) {
            actions.push(
                <Row>
                    <Toggle 
                        toggled={actionMap[0][key]}
                        id={key}
                        labelA="Incomplete"
                        labelB="Complete"
                        labelText={key}
                        onClick={() => handleClick(key)}
                        />
                </Row>
            )
        }
        return(actions);
    }
    
    const getFarmerList = async() => {
        const farmers = await getAllFarmers();
        setFarmerList(farmers);
    }

    const handleFarmerSelection = async(event:any) => {
        const fieldResponse = await fieldAPI.getFieldForFarmer(event.target.value);
        setFarmer(event.target.value);
        setField(fieldResponse);
        setReputationActionMap(OrganizeReputationActions(fieldResponse));
    }

    useEffect(() => {
        if(!farmerList.length){
            getFarmerList();
        }

    },[])

    return(
        <>
        <Row>
            <Column>
                <Select
                    defaultValue="select-crop"
                    helperText=""
                    id="select-1"
                    labelText="Farmers"
                    size="md"
                    onChange={handleFarmerSelection}
                    >
                    <SelectItem
                        disabled
                        hidden
                        text="Select A Farmer"
                        value="select-farmer"
                    />
                    {
                        farmerList.map((item: Farmer) => {
                            return(
                                <SelectItem
                                    text={item.name}
                                    value={item._id}
                                />
                            )
                        })
                    }  
                </Select>
            </Column>
        </Row>
        {(Object.keys(reputationActionMap).length > 0) && getValueMap(reputationActionMap).map((item) => {
                return(
                    <>
                        {item}
                    </>
                )
            })
        }
        </>
    )
}

export default ReputationActions;