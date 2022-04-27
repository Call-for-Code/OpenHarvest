import { Card , CARD_SIZES} from 'carbon-addons-iot-react';
import React, { useEffect, useState } from "react";
import { CardData, getDashboardCards } from '../../services/dashboard';


export function LandAreaCard() {
    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totLand));
    }, );
    
    return(
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Land Area'}
    >
    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData} ha</p>
    </div>
    
    </Card>
    );
}



//Number of crops card
export function NumCropsCard() {

    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totCrops));
    }, );


    return(
    <Card
    size={CARD_SIZES.SMALL}
    title={'No of Crops'}
    >
    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData}</p>
    </div>
    </Card>

    );
}

//Number of farmers card
export function NumFarmersCard() {
    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totFarmers));
    }, );

    return(
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Farmers'}
    >

    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData}</p>
    </div>

    </Card>



    );
}

//Precipitation in past week card
export function PrecipWeekCard() {

    const [cardData, setCardData] = useState<CardData>();

    useEffect(() => {
        getDashboardCards().then((data) => setCardData(data.totPrecip));
    }, );
    


    return(
    <Card
    size={CARD_SIZES.SMALL}
    title={'Total Precipitation in Past Week'}
    >

    <div className="flex-1 w-7/12">
            <p className="text-lg">{cardData}</p>
    </div>

    </Card>
    );
}

