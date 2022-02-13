
import { Schema, Model, ObjectId } from 'mongoose';

const ObjectId = Schema.ObjectId;

export const FarmerSchema = new Schema({
  _id: ObjectId,
  type: String,
  name: String,
  mobile: [String],
  land_ids: [ObjectId]
});

export const FarmerModel = new Model("farmer", FarmerSchema);