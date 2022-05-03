import { Feature, Polygon } from "geojson";
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Crop } from "./crop";
const ObjectId = Schema.Types.ObjectId;

export interface SubFieldCrop {
    planted: Date;
    harvested: Date | null;
    farmer: string;
    /**
     * Crop Information
     */
    crop: Crop;
}

export interface SubFieldProperties {
    /**
     * Area in Square Meters
     */
    area: number;
    bbox: {
        northEast: {lat: number, lng: number},
        southWest: {lat: number, lng: number}
    },
    centre: {
        lat: number,
        lng: number
    }
    crops: SubFieldCrop
}

export interface SubField extends Feature<Polygon, SubFieldProperties> {
    _id?: Types.ObjectId;
    name: string;
}

export const SubFieldSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    name: String,
    type: String,
    properties: Object,
    geometry: Object
});

export interface Field {
    _id?: Types.ObjectId;
    farmer_id: string,
    bbox: {
        northEast: {lat: number, lng: number},
        southWest: {lat: number, lng: number}
    },
    subFields: SubField[];
}

export const FieldSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    // coopOrganisations: [String], // The field belongs to the org of the farmer
    farmer_id: String,
    bbox: Object,
    subFields: [SubFieldSchema]
});

export const FieldModel = model<Field>("field", FieldSchema);