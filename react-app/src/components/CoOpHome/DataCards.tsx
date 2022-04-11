import { Card , CARD_SIZES} from 'carbon-addons-iot-react';
import React from "react";


export function LandAreaCard() {
    return(
    <div style={{ width: `300px`, margin: 20 }}>    
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Land Area'}
    />
    </div>
    );
}



//Number of crops card
export function NumCropsCard() {
    return(
    <div style={{ width: `300px`, margin: 20 }}>
    <Card
    size={CARD_SIZES.SMALL}
    title={'No of Crops'}
    />
    </div>
    );
}

//Number of farmers card
export function NumFarmersCard() {
    return(
    <div style={{ width: `300px`, margin: 20 }}>
    <Card
    size={CARD_SIZES.LARGE}
    title={'Total Farmers'}
    />
    </div>
    );
}

//Precipitation in past week card
export function PrecipWeekCard() {
    return(
    <div style={{ width: `300px`, margin: 20 }}>
    <Card
    size={CARD_SIZES.LARGE}
    title={'Total Precipitation in Past Week'}
    />
    </div>
    );
}

