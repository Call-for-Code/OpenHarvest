import axios from "axios";
import { EISField, EISFieldCreateResponse, EISSubFieldSearchReturn, FieldResponse, Fields } from "./EIS.types";


export class EISAPIService {
    
    access_token = "";
    /**
     * This is a millisecond based timestamp of when the token is due to expire.
     * If we're 10 minutes away from it we renew the token
     */
    expiration = 0;

    baseAPI = "https://foundation.agtech.ibm.com/v2/";

    authAxios = axios.create({});

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

            this.authAxios.defaults.headers.common['Authorization'] = `Bearer ${this.access_token}`;

            return true;
        }
        return false;
    }

    async createField(field: EISField): Promise<EISFieldCreateResponse> {
        await this.ensureToken();

        const res = await this.authAxios.post<EISFieldCreateResponse>(this.baseAPI + "field", field);
        return res.data;
    }

    async getFields() {
        await this.ensureToken();
        const res = await this.authAxios.get<Fields>(this.baseAPI + "field");
        return res.data
    }

    async getField(uuid: string) {
        await this.ensureToken();
        const fieldRes = await this.authAxios.get<FieldResponse>(this.baseAPI + `field/${uuid}`);
        
        const field = fieldRes.data;
        
        // We need to convert the OpenHarvest object from a string to JSON because EIS stores it as a string
        for (let i = 0; i < field.subFields.features.length; i++) {
            const subField = field.subFields.features[i];
            subField.properties.open_harvest = JSON.parse(subField.properties.open_harvest as any);
        }

        return fieldRes.data;
    }

    async getFarmerField(farmer_id: string): Promise<FieldResponse | null> {
        await this.ensureToken();
        
        const queryBody = {
            "uuidsOnly": false,
            "inputType": "SPECIFIED_FIELD",
            "includeDeleted": true,
            "includeAssetGeometry": true,
            "properties": {
                open_harvest: {
                    farmer_id
                }
            }
        };

        const res = await this.authAxios.post<EISSubFieldSearchReturn>(this.baseAPI + "asset/search", queryBody);
        const subfields = res.data;

        if (subfields.totalRecords == 0) {
            return null;
        }

        // Get the parent reference which points to the field uuid
        const fieldUuid = subfields.features[0].parentReference;

        try {
            return await this.getField(fieldUuid);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    


}