import axios, { AxiosInstance } from "axios";
import { EISConfig } from "../../../../common-types/integrations/EISConfig";
import { isUndefined } from "common-types";

type EISSession = {
    token: string,
    expiration: number,
    authAxios: AxiosInstance,
    eisConfig: EISConfig
};

export abstract class EISService {
    private readonly accessTokens: {
        [name: string]: EISSession
    } = {};

    /**
     * This is a millisecond based timestamp of when the token is due to expire.
     * If we're 10 minutes away from it, we renew the token
     */

    // baseAPI = "https://foundation.agtech.ibm.com/v2/";
    //tokenUrl = "https://auth-b2b-twc.ibm.com/Auth/GetBearerForClient";

    async getToken(eisConfig: EISConfig): Promise<EISSession> {

        const accessTokenKey = `${eisConfig.clientId}:${eisConfig.apiKey}`;

        const accessToken: EISSession = this.accessTokens[accessTokenKey];

        // 10 minutes earlier we try to renew the token
        if (isUndefined(accessToken) || accessToken.expiration == 0 || Date.now() > (accessToken.expiration - 600000)) {
            // Token is expired
            const res = await axios.post(eisConfig.tokenUrl, {
                "apiKey": eisConfig.apiKey,
	            "clientId": eisConfig.clientId // "ibm-agro-api"
            });

            const authAxios = accessToken?.authAxios || axios.create({});
            const newToken = res.data.access_token;
            authAxios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

            this.accessTokens[accessTokenKey] = {
                token: newToken,
                expiration: Date.now() + (res.data.expires_in * 1000),
                authAxios,
                eisConfig
            };
        }
        return this.accessTokens[accessTokenKey];
    }

}

