
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface Crop {
    _id?: Types.ObjectId,
    type: string,
    name: string,
    // Start Day of year to end Day of year when to plant the ground nuts 
    planting_season: number[],
    time_to_harvest: number,
    is_ongoing: boolean,
    yield_per_sqm: number
}

export const CropSchema = new Schema({
    _id: ObjectId,
    type: String,
    name: String,
    // Start Day of year to end Day of year when to plant the ground nuts
    planting_season: [Number],
    time_to_harvest: Number,
    is_ongoing: Boolean,
    yield_per_sqm: Number
});

export const CropModel = model<Crop>("crop", CropSchema);