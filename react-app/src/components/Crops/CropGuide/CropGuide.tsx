import React from 'react'
import { PageTitleBar } from "carbon-addons-iot-react";

export interface CropGuide {
    name: string;
    actions: {
        name: string;
        dayDelta: string
    }
}


export function CropGuideList() {
    return <div>
        Crop Guide List
    </div>
}

export interface CropGuideListItemProps {
    isActive: boolean;
    name: string;
    preview: string;
    farmer_id: string;
    onClick?: () => void;
}

export function CropGuideListItem(props: CropGuideListItemProps) {
    return <div className={`py-5 hover:bg-[#e0e0e0] border-l-[3px] border-solid cursor-pointer ${props.isActive ? "border-[#4589ff]" : "border-transparent"}`} onClick={() => props.onClick && props.onClick()}>
        <div className="h-12 flex flex-row">
            <div className="w-12 h-12 mx-3 relative flex flex-none justify-center items-center rounded-full bg-red-500 text-xl text-white uppercase">{props.name.split(" ").map((n)=>n[0]).join("")}</div>
            <div className="flex flex-col justify-center item-start overflow-hidden">
                <span className="grow">{props.name}</span>
                <span className="grow truncate overflow-hidden">{props.preview}</span>
            </div>        
        </div>
    </div>
}

/**
 * The edit / new pane
 */
export function CropGuideDetails() {
    return <div>
        Crop Guide Details
    </div>
}

/**
 * Page view
 * I'm going to go for a master detail view
 */
export function CropGuide() {
    return <div className="flex flex-col">
        <PageTitleBar
            title={"Crop Guides"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />

        <div className="flex flex-row h-[calc(100vh-96px)]">
            {/* Conversation List */}
            <div className="w-2/12 border-r-2 border-gray-300 border-solid">
                <CropGuideList />
                
            </div>
            {/* Conversation */}
            <div className="w-10/12 flex flex-col">
                <CropGuideDetails />
            </div>
            <div>
        </div>

        </div>
    </div>
}

