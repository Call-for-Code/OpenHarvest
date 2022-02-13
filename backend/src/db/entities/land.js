// Using Node.js `require()`
import { Schema, Model } from 'mongoose';

const ObjectId = Schema.ObjectId;

const FarmerCropSchema = new Schema({
    _id: ObjectId,
    farmer: ...
    crop: 
});

const LandSchema = new Schema({
    _id: ObjectId,
    type: String,
    fid: number,
    name: String,
    crops: 
});

export const LandModel = new Model("land", LandSchema);