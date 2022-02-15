// Using Node.js `require()`
import { Schema, Model, model, Types } from 'mongoose';
import { CropSchema, Crop } from "./crop";
import { FarmerSchema, Farmer } from './farmer';

const ObjectId = Schema.Types.ObjectId;

export interface FarmerCrop {
    _id?: Types.ObjectId,
    farmer: Farmer,
    crop: Crop
}

export const FarmerCropSchema = new Schema<FarmerCrop>({
    _id: ObjectId,
    farmer: FarmerSchema,
    crop: CropSchema
});

export interface Land {
    _id?: Types.ObjectId,
    type: string,
    fid: number,
    name: string,
    crops: FarmerCrop[]
}

export const LandSchema = new Schema<Land>({
    _id: ObjectId,
    type: String,
    fid: Number,
    name: String,
    crops: [FarmerCropSchema]
});

export const LandModel = model<Land>("land", LandSchema);