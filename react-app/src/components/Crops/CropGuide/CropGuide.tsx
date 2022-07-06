import React, { useState } from 'react'
import { PageTitleBar } from "carbon-addons-iot-react";

interface Action {
    /**
     * The name of the action
     */
    name: string;
    /**
     * The phase we're at. i.e. Preplanting, planting, mamangement, harvest, post-harvest
     */
    phase: string;
    /**
     * The days delta from the previous action
     */
    dayDelta: number;
    /**
     * The reputation base value to be given out when completed
     */
    reputationBase: number;
    /**
     * The modifier percentage that can be modified by the coop manager
     */
    reputationPercentModifier: number;
    /**
     * Message to send to the farmer
     */
    message: string;
}

export interface CropGuide {
    /**
     * UUID
     */
    _id: string;
    /**
     * The name of the guide
     */
    name: string;
    /**
     * The Crop this is associcated to
     */
    crop_id: string;
    /**
     * Actions that should be taken for this crop guide
     */
    actions: Action[]
}

export interface CropGuideListProps {
    cropGuides: CropGuide[];
    activeIndex: number;
    onItemSelected: (cropGuideId: string, index: number) => void;
}

export function CropGuideList(props: CropGuideListProps) {
    return <div>
        {props.cropGuides.map((it, i) => <CropGuideListItem key={"cropGuide" + i} cropGuide={it} isActive={i == props.activeIndex} onClick={() => props.onItemSelected(it._id, i)}/>)}
    </div>
}

export interface CropGuideListItemProps {
    isActive: boolean;
    cropGuide: CropGuide;
    onClick?: () => void;
}

export function CropGuideListItem(props: CropGuideListItemProps) {
    const { cropGuide } = props;
    return <div className={`py-5 hover:bg-[#e0e0e0] border-l-[3px] border-solid cursor-pointer ${props.isActive ? "border-[#4589ff]" : "border-transparent"}`} onClick={() => props.onClick && props.onClick()}>
        <div className="flex flex-col justify-center item-start overflow-hidden">
            <span className="grow">{cropGuide.name}</span>
            <span className="grow truncate overflow-hidden">{cropGuide.name}</span>
        </div>
    </div>
}

export interface CropGuideDetailsProps {
    cropGuide: CropGuide;
}

/**
 * The edit / new pane
 */
export function CropGuideDetails(props: CropGuideDetailsProps) {
    return <div>
        Crop Guide Details
        <pre>
            {JSON.stringify(props.cropGuide, null, 2)}
        </pre>
        
    </div>
}

/**
 * Page view
 * I'm going to go for a master detail view
 */
export function CropGuide() {
    const testData: CropGuide[] = [{
        _id: "1",
        name: "Test Guide",
        crop_id: "1",
        actions: [{
            name: "First Action",
            phase: "pre-planting",
            dayDelta: 0,
            reputationBase: 20,
            reputationPercentModifier: 0.25,
            message: "you gotta plant"
        }]
    }];


    const [activeIndex, setActiveIndex] = useState(0);
    const selectedCropGuide = testData[activeIndex];    

    const data: CropGuideListProps = {
        cropGuides: testData,
        activeIndex,
        onItemSelected(cropGuideId, index) {
            setActiveIndex(index)
        },
    }

    return <div className="flex flex-col">
        <div className="flex flex-row h-[calc(100vh-96px)]">
            {/* Conversation List */}
            <div className="w-2/12 border-r-2 border-gray-300 border-solid">
                <CropGuideList {...data}/>
                
            </div>
            {/* Conversation */}
            <div className="w-10/12 flex flex-col">
                <CropGuideDetails cropGuide={selectedCropGuide}  />
            </div>
            <div>
        </div>

        </div>
    </div>
}

