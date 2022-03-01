import axios from 'axios'

export interface CoopManager {
    /**
     * Auth provider + auth provider id. E.g. "IBMid:1SDAS61W6A"
     */
    _id?: string,
    /**
     *  GeoCode / LatLng coordinate tuple
     */
    location: number[],
    mobile: string
}

export async function onboard(oAuthSource: string, oAuthId: string, user: CoopManager, orgId: string): Promise<CoopManager> {
    const data = await axios.post<CoopManager>("/api/coopManager/onboard/", {
        oAuthSource,
        oAuthId,
        user,
        orgId
    })
    return data.data;
}