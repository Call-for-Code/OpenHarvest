import React, { useState } from 'react'
import { CropGuideDetails } from './CropGuideDetails/CropGuideDetails';
import { CropGuideList, CropGuideListProps } from './CropGuideList';
import { CropGuide } from "./types";

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
    },
    {
        name: "second Action",
        phase: "pre-planting",
        dayDelta: 1,
        reputationBase: 20,
        reputationPercentModifier: 0.25,
        message: "chuck some seeds on the ground"
    },
    {
        name: "third Action",
        phase: "pre-planting",
        dayDelta: 2,
        reputationBase: 20,
        reputationPercentModifier: 0.25,
        message: "wait for a mate"
    }]
}];

/**
 * Page view
 * I'm going to go for a master detail view
 */
export function CropGuideView() {
    
    const [testDataState, setTestDataState] = useState(testData);

    const [activeIndex, setActiveIndex] = useState(0);
    const selectedCropGuide = testDataState[activeIndex];

    const data: CropGuideListProps = {
        cropGuides: testData,
        activeIndex,
        onItemSelected(cropGuideId, index) {
            setActiveIndex(index)
        },
    }

    function updateSelectedCropGuide(newGuide: CropGuide) {
        // For react which does shallow equality...
        const newArray = [...testDataState];
        newArray[activeIndex] = newGuide;
        setTestDataState(newArray);
    }

    return <div className="flex flex-col">
        <div className="flex flex-row h-[calc(100vh-96px)]">
            {/* Conversation List */}
            <div className="w-2/12 border-r-2 border-gray-300 border-solid">
                <CropGuideList {...data}/>
                
            </div>
            {/* Conversation */}
            <div className="w-10/12 flex flex-col">
                <CropGuideDetails cropGuide={selectedCropGuide} onUpdate={updateSelectedCropGuide}  />
            </div>
            <div>
        </div>

        </div>
    </div>
}

