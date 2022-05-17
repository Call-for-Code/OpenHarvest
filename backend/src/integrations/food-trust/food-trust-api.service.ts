import axios, { AxiosRequestConfig} from 'axios';
import {lotCommissionXML, serialAndPalletCommissionXML, lotObservationXML, serialAndPalletObservationXML, transformationXML, aggregationXML} from './xmlHelpers'

let expiration = 0;
let iftToken = "";
const serviceTokenAPI = 'https://iam.cloud.ibm.com/identity/token';
const iftAPI = 'https://sandbox.transparentsupply.ibm.com/ift/api/'

export class FoodTrustAPI {

    async setToken(){
        if(Date.now() <= expiration || expiration == 0){
            const iamServiceToken = await this.getIamServiceToken();
            expiration = iamServiceToken.expiration

            const iftTokenData = await this.getIFTToken(iamServiceToken);
            iftToken = "Bearer " +  iftTokenData.onboarding_token
        }
        return iftToken
    }

    // retrieve IAM token
    getIamServiceToken(){
        const data = 'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + process.env.food_trust_apiKey;
        const config : AxiosRequestConfig = {
          url: serviceTokenAPI,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: data
        };

        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response
      }
    
    // exchange IAM token for IFT token
    getIFTToken(iamTokenData) {
        const endpoint_url = iftAPI + 'identity-proxy/exchange_token/v1/organization/' + process.env.organization_id;
        const config : AxiosRequestConfig= {
            url: endpoint_url,
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            data: iamTokenData
        };
        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response;
    }

    async getProducts(){
        let authorization = await this.setToken().then((data) =>{
            return data
        })
        const endpoint_url = iftAPI + "outbound/v2/products";
        const config : AxiosRequestConfig= {
            url: endpoint_url,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'owning_org_id': process.env.organization_id+"",
                'Authorization': authorization
            },
        };
        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response;
    }

    async getProductsByDescription(){
        let authorization = await this.setToken().then((data) =>{
            return data
        })
        
        const endpoint_url = iftAPI + "outbound/v2/products";
        const config : AxiosRequestConfig= {
            url: endpoint_url,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': authorization
            },
            params:{
                'description': "Groundnu",
            }
        };
        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response;
    }

    async getLocations(){
        let authorization = await this.setToken().then((data) =>{
            return data
        })
        const endpoint_url = iftAPI + "outbound/v2/locations";
        const config : AxiosRequestConfig= {
            url: endpoint_url,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': authorization
            },
        };
        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response;
    }

    async getLocationsByOrg(){
        let authorization = await this.setToken().then((data) =>{
            return data
        })
        const endpoint_url = iftAPI + "outbound/v2/locations";
        const config : AxiosRequestConfig= {
            url: endpoint_url,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'owning_org_id': process.env.organization_id+"",
                'Authorization': authorization
            },
        };
        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response;
    }

    async issueIFTTransaction(requestMap){       
        let authorization = await this.setToken().then((data) =>{
            return data
        })
        let data = "";
        
        switch(requestMap.eventType){
            case "COMMISSION":
                requestMap.eventType = "ADD"
                if(requestMap.packingIdType === "lot"){
                    data = lotCommissionXML(requestMap)
                }else{
                    data = serialAndPalletCommissionXML(requestMap)
                }
                break;
            case "OBSERVATION":
                requestMap.eventType = "OBSERVE"
                if(requestMap.packingIdType === "lot"){
                    data = lotObservationXML(requestMap)
                }else{
                    data = serialAndPalletObservationXML(requestMap)
                }
                break;
            case "AGGREGATION":
                requestMap.evenType = "ADD"
                data = aggregationXML(requestMap)
                break;
            case "TRANSFORMATION":
                data = transformationXML(requestMap)
                break;
            default:
                break;
        }

        const endpoint_url = iftAPI + "connector/fs/connector/v1/assets";
        
        const config : AxiosRequestConfig= {
            url: endpoint_url,
            method: 'POST',
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/xml'
            },
            data: data
        };
        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response;
    }

    async getEventByAssetId(asset_id){
        let authorization = await this.setToken().then((data) =>{
            return data
        })
        const endpoint_url = iftAPI + "outbound/v2/events";
        const config : AxiosRequestConfig= {
            url: endpoint_url,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': authorization
            },
            params:{
                'asset_id': asset_id,
            }
        };
        const response = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
        return response;
    }
}