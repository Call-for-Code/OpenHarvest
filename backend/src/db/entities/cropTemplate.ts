
import mongoose, { Schema, model, ObjectId } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

/*
    The CropTemplatesSchema will store the weights assigned to each action. This weight is used during the repuation
    calculation to produce the number of reputation tokens which should given to a farmer.
*/


export interface CropTemplate{
    _id?: string,
    action_weights: Record<string, string>,
    crop_template_name: string,
    max_payout: number
}

export const CropTemplateSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    action_weights: {
        type: Map,
        of: String,
        default: {}
    },
    crop_template_name: String,
    max_payout: Number
});

export const CropTemplateModel = model<CropTemplate>("cropTemplate", CropTemplateSchema);