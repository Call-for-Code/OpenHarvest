import { Crop } from "./../../db/entities/crop";
import { FeatureCollection, Polygon } from "geojson";

// Field Data
export interface FieldProperties {
    name: string;
    inputType: "SPECIFIED_FIELD",
    deleted: boolean,
    profileId: string,
    cluId: "1234567890",
    insurancePolicyNumber: "1234",
    creationTime: Date
}

export interface Fields {
    type: "FeatureCollection";
    features:  {
        properties: FieldProperties,
        uuid: string;
        type: "Feature"
    }
}




// SubField Data
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


