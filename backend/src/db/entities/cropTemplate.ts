
import { string } from '@tensorflow/tfjs-node';
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

/*
    The CropTemplatesSchema will store the weights assigned to each action. This weight is used during the repuation
    calculation to produce the number of reputation tokens which should given to a farmer.
*/
export interface CropTemplate {
    _id?: Types.ObjectId;
    action_a_weight: number;
    action_b_weight: number;
    action_c_weight: number;
    action_d_weight: number;
    crop_template_name: string;
}

export const CropTemplateSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    action_a_weight: Number,
    action_b_weight: Number,
    action_c_weight: Number,
    action_d_weight: Number,
    crop_template_name: String
});

export const CropTemplateModel = model<CropTemplate>("cropTemplates", CropTemplateSchema);