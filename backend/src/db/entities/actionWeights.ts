
import { string } from '@tensorflow/tfjs-node';
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

/*
    The ActionWeightSchema will store the weights assigned to each action. This weight is used during the repuation
    calculation to produce the number of reputation tokens which should given to a farmer.
*/
export interface ActionWeights {
    _id?: Types.ObjectId;
    action_a_weight: number;
    action_b_weight: number;
    action_c_weight: number;
    action_d_weight: number;
    crop_template_id: string;
}

export const ActionWeightsSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    action_a_weight: Number,
    action_b_weight: Number,
    action_c_weight: Number,
    action_d_weight: Number,
    crop_template_id: String
});

export const ActionWeightsModel = model<ActionWeights>("actionWeights", ActionWeightsSchema);