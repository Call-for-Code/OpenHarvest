import { FeatureCollection, Polygon } from "geojson";

export interface Crop {
    name: string;
    planting_season: Date[],
    time_to_harvest: number,
    is_ongoing: boolean,
    yield_per_sqm: number
}

export interface SubFieldCrop {
    planted: Date;
    harvested: Date;
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