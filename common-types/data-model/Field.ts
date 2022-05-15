import { Polygon } from "geojson";
import FieldCrop, { NewFieldCrop } from "./FieldCrop";


export interface NewField {
    _id?: string,
    name: string;
    geoShape: Polygon;
    crops: NewFieldCrop[]
}

export default interface Field extends NewField {
    _id: string,
    crops: FieldCrop[]
}
