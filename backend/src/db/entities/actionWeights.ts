
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface ActionWeights {
    _id?: Types.ObjectId;
    farmer_id: string;
    action_a_weight: number;
    action_b_weight: number;
    action_c_weight: number;
    action_d_weight: number;
}

export const ActionWeightsSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    farmer_id: String,
    action_a_weight: Number,
    action_b_weight: Number,
    action_c_weight: Number,
    action_d_weight: Number,

});

export const ActionWeightsModel = model<ActionWeights>("actionWeights", ActionWeightsSchema);