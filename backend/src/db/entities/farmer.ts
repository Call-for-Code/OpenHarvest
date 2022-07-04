
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Field } from "./field";

const ObjectId = Schema.Types.ObjectId;

export interface Farmer {
    _id?: Types.ObjectId,
    name: string,
    mobile: string,
    address: string,
    coopOrganisations: string[],
    fieldCount: number;
    field?: Field;
    ethKeyID: string;
}

export const FarmerSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    name: String,
    mobile: String,
    address: String,
    coopOrganisations: [String],
    fieldCount: Number,
    ethKeyID: String
});

export const FarmerModel = model<Farmer>("farmer", FarmerSchema);