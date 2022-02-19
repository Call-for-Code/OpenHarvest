import React, { Component, ReactElement } from "react";
import { PageTitleBar } from "carbon-addons-iot-react";

type FarmersProps = {};
type FarmersState = {};


export default class Farmers extends Component<FarmersProps, FarmersState> {

    render(): ReactElement {
        return <PageTitleBar
            title={"Farmers"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />;
    }
}
