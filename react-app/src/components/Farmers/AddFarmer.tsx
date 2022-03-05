import React from "react";
import { PageTitleBar } from "carbon-addons-iot-react";
import { FieldEditorMap } from "./../Map/FieldEditorMap";



export function AddFarmer() {

    return <>
        <PageTitleBar
            title={"Add a Farmer"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />
        {/* // Content container */}
        <div className="w-full h-[calc(100vh-96px)] flex flex-row">
            <div className="w-1/2">
                <FieldEditorMap></FieldEditorMap>
            </div>
            <div className="w-1/2">
                Form
            </div>
        </div>
    </>;
}