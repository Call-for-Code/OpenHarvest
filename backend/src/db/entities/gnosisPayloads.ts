
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface GnosisPayloads {
    _id?: Types.ObjectId;
    farmer_id: string;
    actions_taken: {
        action_a_completed: boolean,
        action_b_completed: boolean,
        action_c_completed: boolean,
        action_d_completed: boolean,
    };
}

export const GnosisPayloadsSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    farmer_id: String,
    actions_taken: {
        action_a_completed: Boolean,
        action_b_completed: Boolean,
        action_c_completed: Boolean,
        action_d_completed: Boolean,
    }
});

export const GnosisPayloadModel = model<GnosisPayloads>("gnosisPayloads", GnosisPayloadsSchema);