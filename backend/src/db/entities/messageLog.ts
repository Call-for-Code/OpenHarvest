
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface MessageLog {
    _id?: Types.ObjectId;
    farmer_id: string;
    message: string;
    timeSent: Date;
}

export const MessageLogSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    farmer_id: String,
    message: String,
    timeSent: Date
});

export const MessageLogModel = model<MessageLog>("messageLog", MessageLogSchema);