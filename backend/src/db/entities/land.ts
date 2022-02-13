// Using Node.js `require()`
import { Schema, Model } from 'mongoose';
import { CropSchema } from "./crop";
import { FarmerSchema } from './farmer';

const ObjectId = Schema.Types.ObjectId;

export const FarmerCropSchema = new Schema({
    _id: ObjectId,
    farmer: FarmerSchema,
    crop: CropSchema
});

export const LandSchema = new Schema({
    _id: ObjectId,
    type: String,
    fid: Number,
    name: String,
    crops: [FarmerCropSchema]
});

export const LandModel = new Model("land", LandSchema);