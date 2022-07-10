import React from 'react'
import { CropGuide } from './types';

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