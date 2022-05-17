import { model, Schema, Types } from 'mongoose';
import { Farmer } from '../../../../common-types/src';
import { FarmSchema } from "./farm";

export const FarmerSchema = new Schema<Farmer>({
    _id: Types.ObjectId,
    name: String,
    mobile: String,
    address: String,
    organisation: String,
    farms: [FarmSchema]
});

export const FarmerModel = model<Farmer>("farmer", FarmerSchema);
