
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export enum Source {
    Farmer = "Farmer",
    OpenHarvest = "OpenHarvest",
    Other = "Other"
}

export interface MessageLog {
    _id?: Types.ObjectId;
    farmer_id: string;
    /**
     * Address is just the generic way to refer to a phone number or and email.
     */
    address: string;
    message: string;
    isViewed: boolean;
    source: Source
    timestamp: Date;
}

export const MessageLogSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    farmer_id: String,
    /**
     * Address is just the generic way to refer to a phone number or and email.
     */
    address: String,
    message: String,
    isViewed: Boolean,
    source: String,
    timestamp: Date
});

export const MessageLogModel = model<MessageLog>("messageLog", MessageLogSchema);