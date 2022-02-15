
import { Schema, model, ObjectId, Types } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface Crop {
    _id?: Types.ObjectId,
    type: string,
    name: string,
    planting_season: Date[],
    is_ongoing: boolean
}

export const CropSchema = new Schema({
    _id: ObjectId,
    type: String,
    name: String,
    planting_season: [Date],
    is_ongoing: Boolean
});

export const CropModel = model<Crop>("crop", CropSchema);