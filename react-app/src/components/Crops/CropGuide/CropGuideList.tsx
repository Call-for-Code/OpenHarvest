import React from 'react'
import { CropGuideListItem } from './CropGuideListItem';
import { CropGuide } from './types';


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