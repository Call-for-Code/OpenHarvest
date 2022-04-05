import { Card , CARD_SIZES} from 'carbon-addons-iot-react';
import React from "react";


export function LandAreaCard() {
    return(
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Land Area'}
    
    />
    );
}



//Number of crops card
export function NumCropsCard() {
    return(
    <Card
    size={CARD_SIZES.SMALL}
    title={'No of Crops'}
    />

    );
}

//Number of farmers card
export function NumFarmersCard() {
    return(
    <Card
    size={CARD_SIZES.LARGE}
    title={'Total Farmers'}
    />

    );
}

//Precipitation in past week card
export function PrecipWeekCard() {
    return(
    <Card
    size={CARD_SIZES.LARGE}
    title={'Total Precipitation in Past Week'}
    />

    );
}