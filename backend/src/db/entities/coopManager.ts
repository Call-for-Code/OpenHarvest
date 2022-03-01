
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Land } from './land';

const ObjectId = Schema.Types.ObjectId;

export interface CoopManager {
    /**
     * Auth provider + auth provider id. E.g. "IBMid:1SDAS61W6A"
     */
    _id?: string,
    /**
     *  GeoCode / LatLng coordinate tuple
     */
    location: number[],
    mobile: string
}

export const CoopManagerSchema = new Schema({
    /**
     * Auth provider + auth provider id. E.g. "IBMid:1SDAS61W6A"
     */
    _id: String,
    /**
     *  GeoCode / LatLng coordinate tuple
     */
    location: [Number],
    mobile: String
});

export const CoopManagerModel = model<CoopManager>("coopManager", CoopManagerSchema);
