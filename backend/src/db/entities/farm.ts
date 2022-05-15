import { model, Schema, Types } from 'mongoose';
import { FarmerSchema } from './farmer';

import { Field, FieldCrop, NewFarm } from "common-types"
import { CropSchema } from "./crop";

export const FieldCropSchema = new Schema<FieldCrop>({
    crop: CropSchema,
    planted_date: Date,
    harvested_date: Date
}, {id: false});

export const FieldSchema = new Schema<Field>({
    _id: Types.ObjectId,
    name: String,
    crops: [FieldCropSchema],
    geoShape: {
        type: "Polygon",
        coordinates: [[Number]]
    },
});

export const FarmSchema = new Schema<NewFarm>({
    _id: Types.ObjectId,
    farmer: FarmerSchema,
    name: String,
    fields: [FieldSchema],
    geoShape: {
        type: "Polygon",
        coordinates: [[Number]]
    },
});

export const FarmModel = model<NewFarm>("farm", FarmSchema);
