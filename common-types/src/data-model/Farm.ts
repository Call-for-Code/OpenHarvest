import { Polygon } from "geojson";
import Field, { NewField } from "./Field";

export interface NewFarm {
    _id?: string,
    name: string;
    fields: NewField[];
    geometry?: Polygon;
}

export default interface Farm extends NewFarm {
    _id: string,
    fields: Field[]
}


