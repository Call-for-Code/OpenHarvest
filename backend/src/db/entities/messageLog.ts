import { model, Schema, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export enum Source {
    Farmer = "Farmer",
    OpenHarvest = "OpenHarvest",
    Other = "Other"
}

export enum Status {
    Sending = "Sending",
    Sent = "Sent",
    Delivered = "Delivered",
    Failed = "Failed",
    Unknown = "Unknown",
    Unread = "Unread",
    Read = "Read"
}

export interface MessageLog {
    _id?: Types.ObjectId;
    farmer_id: string;
    /**
     * Address is just the generic way to refer to a phone number or and email.
     */
    address: string;
    message: string;
    status: Status;
    source: Source
    timestamp: Date;
    /**
     * For auditing purposes this is the message id from the service
     */
    messageRef: string;
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
    status: String,
    source: String,
    timestamp: Date,
    /**
     * For auditing purposes this is the message id from the service
     */
    messageRef: String
});

export const MessageLogModel = model<MessageLog>("messageLog", MessageLogSchema);
