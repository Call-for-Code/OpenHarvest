import { model, Schema, Types } from 'mongoose';

import { Crop } from "common-types"

// Mongoose will automatically add _id property.
export const CropSchema = new Schema<Crop>({
    _id: Types.ObjectId,
    type: String,
    name: String,
    // Start Day of year to end Day of year when to plant the ground nuts
    planting_season: [Number],
    time_to_harvest: Number,
    yield_per_sqm: Number
});

export const CropModel = model<Crop>("crop", CropSchema);
