
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Farmer } from './farmer';

const ObjectId = Schema.Types.ObjectId;

export interface MessageGroup {
    _id?: Types.ObjectId;
    farmer_ids: string[];
    farmers?: Farmer[];
    farmer_id_index?: string;
}

export const MessageGroupSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    farmer_ids: [String],
    farmer_id_index: {
        type: String,
        default: function() {
            return (this as any).farmer_ids.join("|")
        },
        index: true
    }
});

export const MessageGroupModel = model<MessageGroup>("messageGroup", MessageGroupSchema);