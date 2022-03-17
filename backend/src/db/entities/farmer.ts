
import { FieldResponse } from './../../integrations/EIS/EIS.types';
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Land } from './land';

const ObjectId = Schema.Types.ObjectId;

export interface Farmer {
    _id?: Types.ObjectId,
    name: string,
    mobile: string,
    address: string,
    coopOrganisations: string[],
    fieldCount: number;
    field?: FieldResponse;
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
    fieldCount: Number
});

export const FarmerModel = model<Farmer>("farmer", FarmerSchema);