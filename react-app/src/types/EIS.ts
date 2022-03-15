import { FeatureCollection, Polygon } from "geojson";
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

export interface EISSubFieldProperties {
    farm_name: string
    open_harvest: {
        farmer_id: string;
        crops: SubFieldCrop[]
    }
}

export interface EISSubField {
    name: string;
    geo: {
        type: "geojson" // We only support GeoJSON...
        geojson: FeatureCollection<Polygon, EISSubFieldProperties>
    }
}

export interface EISField {
    name: string;
    subFields: EISSubField[]
}