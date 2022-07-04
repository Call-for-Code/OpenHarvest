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
    mobile: string,
    coopOrganisations: string[]
}

export interface OnboardDTO {
    token: string,
    user: CoopManager
}

export async function onboard(oAuthSource: string, oAuthId: string, user: CoopManager): Promise<OnboardDTO> {
    const data = await axios.post<OnboardDTO>("/api/coopManager/onboard/", {
        oAuthSource,
        oAuthId,
        user,
    }, {
        withCredentials: true
    })
    return data.data;
}