import { Polygon } from "geojson";
import FieldCrop from "./FieldCrop";


export interface NewField {
    _id?: string,
    name: string;
    geometry: Polygon;
    crops: FieldCrop[]
}

export default interface Field extends NewField {
    _id: string,
}
