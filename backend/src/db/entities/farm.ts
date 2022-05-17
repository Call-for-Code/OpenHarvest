import { model, Schema, Types } from 'mongoose';

import { CropSchema } from "./crop";
import { PolygonSchema } from "../mongodb";
import { Field, FieldCrop, NewFarm } from '../../../../common-types/src';

export const FieldCropSchema = new Schema<FieldCrop>({
    crop: CropSchema,
    planted_date: Date,
    harvested_date: Date
}, {id: false});

export const FieldSchema = new Schema<Field>({
    _id: Types.ObjectId,
    name: String,
    crops: [FieldCropSchema],
    geometry: PolygonSchema,
});

export const FarmSchema = new Schema<NewFarm>({
    _id: Types.ObjectId,
    name: String,
    fields: [FieldSchema],
    geometry: PolygonSchema,
});

export const FarmModel = model<NewFarm>("farm", FarmSchema);
