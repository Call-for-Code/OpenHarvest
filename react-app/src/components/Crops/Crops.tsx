import React, { Component, ReactElement } from "react";
import { PageTitleBar } from "carbon-addons-iot-react";

type CropsProps = {};
type CropsState = {};


export default class Crops extends Component<CropsProps, CropsState> {


    componentDidMount() {
        fetch("/api/crop").then(response =>  {
            console.log(response);
        });
    }

    render(): ReactElement {
        return <PageTitleBar
            title={"Crops"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />;
    }
}
