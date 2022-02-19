import React, { Component, ReactElement } from "react";
import { PageTitleBar } from "carbon-addons-iot-react";

type CoOpHomeProps = {};
type CopOpHomeState = {};


export default class CoOpHome extends Component<CoOpHomeProps, CopOpHomeState> {

    render(): ReactElement {
        return <PageTitleBar
            title={"Home"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />;
    }
}
