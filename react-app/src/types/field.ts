import { Feature, Polygon } from "geojson";
import { Crop } from "../services/crops";

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
    area?: number;
    bbox?: {
        northEast: {lat: number, lng: number},
        southWest: {lat: number, lng: number}
    },
    centre?: {
        lat: number,
        lng: number
    }
    crops: SubFieldCrop[]
}

export interface SubField extends Feature<Polygon, SubFieldProperties> {
    _id?: string;
    name: string;
}

export interface Field {
    _id?: string;
    farmer_id: string,
    bbox?: {
        northEast: {lat: number, lng: number},
        southWest: {lat: number, lng: number}
    },
    centre?: {
        lat: number,
        lng: number
    }
    subFields: SubField[];
}