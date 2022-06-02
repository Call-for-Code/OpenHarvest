
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

/*
    The ActionsSchema will store the state of the Farmers [in]complete actions
*/
export interface Actions {
    _id?: Types.ObjectId;
    farmer_id: string;
    action_a_completed: boolean;
    action_b_completed: boolean;
    action_c_completed: boolean;
    action_d_completed: boolean;
}

export const ActionsSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    farmer_id: String,
    action_a_completed: Boolean,
    action_b_completed: Boolean,
    action_c_completed: Boolean,
    action_d_completed: Boolean,

});

export const ActionsModel = model<Actions>("actions", ActionsSchema);