
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Land } from './land';

const ObjectId = Schema.Types.ObjectId;

export interface Farmer {
    _id?: Types.ObjectId,
    name: string,
    mobile: string[],
    address: string,
    coopOrganisations: string[],
}

export const FarmerSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    name: String,
    mobile: [String],
    address: String,
    coopOrganisations: [String],
});

export const FarmerModel = model<Farmer>("farmer", FarmerSchema);