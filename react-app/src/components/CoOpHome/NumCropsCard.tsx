import React, { Component, ReactElement } from "react";
import { PageTitleBar } from "carbon-addons-iot-react";
import { Card , CARD_SIZES} from 'carbon-addons-iot-react';



type NumCropsCardProps = {};
type NumCropsCardState = {};


export default class NumCropsCard extends Component<NumCropsCardProps, NumCropsCardState> {


    componentDidMount() {
        
    }

    render(): ReactElement {
        return  <Card
        size={CARD_SIZES.LARGE}
        title={'Total Farmers'}
        />
    }

}
