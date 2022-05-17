import { Feature, FeatureCollection, Polygon } from "geojson";
import { FieldCrop, GeoCodeNumber } from "../../../../common-types/src";

/**
 * There are many redundant fields you'll notice because EIS's data structures 
 * for fields and subfields changes across requests with a few new fields or added fields
 * It's possible to create a base and extend the types but I really don't have time for that now
 */

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


// Get Field Request
export interface FieldResponseSubfieldFeatureExtras {
    id: number;
    uuid: string;
    fieldUuid: string;
    projection: 4326;
}

export type FieldResponseSubfieldFeature = Feature<Polygon, EISSubFieldSearchReturnFeatureProperties> & FieldResponseSubfieldFeatureExtras;

export interface FieldResponseSubfield {
    type: "FeatureCollection",
    features: FieldResponseSubfieldFeature[]
}

export interface FieldResponse {
    properties: FieldProperties;
    uuid: string;
    type: "Feature";
    subFields: FieldResponseSubfield;
}

export type OpenHarvestSubFieldProps = {
    farmer_id: string;
    crops: FieldCrop[]
};

export interface EISSubFieldProperties {
    farm_name: string
    open_harvest_farmer_id: string;
    /**
     * When getting a field from EIS this is initially a string and we need to parse the object
     */
    open_harvest: OpenHarvestSubFieldProps
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

export interface EISFieldCreateResponse {
    /**
     * UUID of the field
     */
    field: string;
    /**
     * UUID of the subfields
     */
    subFields: string[];
}

// END Field Create Structures

// SubField EIS Return Data
export interface EISSubFieldSearchReturnFeatureProperties {
    area: number;
    box: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
    centroid: GeoCodeNumber;
    ianaTimeZone: string;
    deleted: boolean;
    inputType: string;
    profileId: string;
    farm_id: string;
    farm_name: string;
    field_id: string;
    field_name: string;
    open_harvest: OpenHarvestSubFieldProps
}

export interface EISSubFieldSearchReturnFeatureExtras {
    uuid: string;
    /**
     * This is the field ID that this subfield belongs to
     */
    parentReference: string;
    projection: number;
}

export type EISSubFieldSearchReturnFeature = Feature<Polygon, EISSubFieldSearchReturnFeatureProperties> & EISSubFieldSearchReturnFeatureExtras;

export interface EISSubFieldSearchReturn {
    features: EISSubFieldSearchReturnFeature[];
    totalRecords: number;
    type: "FeatureCollection";
}
// END SubField EIS Return Data

