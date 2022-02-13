
import { Schema, Model, ObjectId } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export const CropSchema = new Schema({
  _id: ObjectId,
  type: String,
  name: String,
  planting_season: [Date],
  is_ongoing: Boolean
});

export const CropModel = new Model("crop", CropSchema);