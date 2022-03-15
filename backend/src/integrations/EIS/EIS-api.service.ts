import axios from "axios";


export class EISAPIService {
    
    access_token = "";
    /**
     * This is a millisecond based timestamp of when the token is due to expire.
     * If we're 10 minutes away from it we renew the token
     */
    expiration = 0;

    baseAPI = "https://foundation.agtech.ibm.com/v2/"

    constructor(private apiKey: string) {

    }


    async ensureToken(): Promise<boolean> {
        // 10 mins earlier we try to renew the token
        if (this.expiration == 0 || Date.now() > (this.expiration - 600000)) {
            // Token is expired
            const res = await axios.post("https://auth-b2b-twc.ibm.com/Auth/GetBearerForClient", {
                "apiKey": this.apiKey,
	            "clientId": "ibm-agro-api"
            });
            
            this.access_token = res.data.access_token;
            this.expiration = Date.now() + (res.data.expires_in * 1000);

            return true;
        }
        return false;
    }

    async getFields() {
        const res = await axios.get(this.baseAPI + "field", {headers: { Authorization: `Bearer ${this.access_token}` }});
        res.data
    }
}