export interface CropGuideAction {
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
    actions: CropGuideAction[]
}
