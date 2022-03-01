
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Land } from './land';

const ObjectId = Schema.Types.ObjectId;

export interface Farmer {
    _id?: Types.ObjectId,
    name: string,
    mobile: string[],
    land_ids: string[]
    lands?: Land[]
}

export const FarmerSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    name: String,
    mobile: [String],
    land_ids: [ObjectId]
});

export const FarmerModel = model<Farmer>("farmer", FarmerSchema);