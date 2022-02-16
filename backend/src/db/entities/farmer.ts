
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface Farmer {
    _id?: Types.ObjectId,
    type: string,
    name: string,
    mobile: string[],
    land_ids: string[]
}

export const FarmerSchema = new Schema({
    _id: ObjectId,
    type: String,
    name: String,
    mobile: [String],
    land_ids: [ObjectId]
});

export const FarmerModel = model<Farmer>("farmer", FarmerSchema);