
export interface CoopManager {
    /**
     * Auth provider + auth provider id. E.g. "IBMid:1SDAS61W6A"
     */
    _id?: string,
    /**
     *  GeoCode / LatLng coordinate tuple
     */
    location: number[],
    mobile: string,
    coopOrganisations: string[]
}
