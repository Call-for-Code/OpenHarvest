import { Point } from "geojson";

export default interface User {
    /**
     * Auth provider + auth provider id. E.g. "IBMid:1SDAS61W6A"
     */
    _id?: string,
    /**
     *  GeoCode / LatLng coordinate tuple
     */
    location: Point,
    mobile: string
}


