import { Card , CARD_SIZES} from 'carbon-addons-iot-react';
import React, { useEffect, useState } from "react";
import { CardData, getDashboardCards } from '../../services/dashboard';

/*
 * TODO: We'll need to convert these to Value Cards instead of normal cards. 
 * We can capture trends and other stuff
 * https://carbon-addons-iot-react.com/?path=/story/1-watson-iot-valuecard--with-trends
 */


export function LandAreaCard() {
    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totLand));
    }, );
    
    return(
    <div style={{ width: `300px`, margin: 20 }}>    
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Land Area'}
    >
    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData} ha</p>
    </div>
    
    </Card>
    </div>
    );
}



//Number of crops card
export function NumCropsCard() {

    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totCrops));
    }, );


    return(
    <div style={{ width: `300px`, margin: 20 }}>
    <Card
    size={CARD_SIZES.SMALL}
    title={'No of Crops'}
    >
    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData}</p>
    </div>
    </Card>
    </div>
    );
}

//Number of farmers card
export function NumFarmersCard() {
    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totFarmers));
    }, );

    return(
    <div style={{ width: `300px`, margin: 20 }}>
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Farmers'}
    >

    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData}</p>
    </div>

    </Card>
    </div>


    );
}

//Precipitation in past week card
export function PrecipWeekCard() {

    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totPrecip));
    }, );
    


    return(
    <div style={{ width: `300px`, margin: 20 }}>
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Precipitation in Past Week'}
    >

    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData}</p>
    </div>

    </Card>
    </div>
    );
}

