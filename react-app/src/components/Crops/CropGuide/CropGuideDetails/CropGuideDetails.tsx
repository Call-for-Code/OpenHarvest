import React from 'react'
import { CropGuide, CropGuideAction } from '../types';
import { CropGuideDetailsActionList } from './CropGuideDetailsActionList';

export interface CropGuideDetailsProps {
    cropGuide: CropGuide;
    onUpdate: (cropGuide: CropGuide) => void;
}

/**
 * The edit / new pane
 */
export function CropGuideDetails(props: CropGuideDetailsProps) {
    const { cropGuide } = props;

    function onActionListUpdate(actions: CropGuideAction[]) {
        cropGuide.actions = actions;
        props.onUpdate(cropGuide)
    }

    return <div>
        Crop Guide Details
        <CropGuideDetailsActionList actions={cropGuide.actions} onUpdate={onActionListUpdate}/>
    </div>
}