// import { isConstructorDeclaration } from "typescript";

export class FoodTrustAPI {
    APIBase = "/api/foodtrust/";

    async foodTrustProducts() {
        const params = {
            method: 'post',
            headers: new Headers({
                
                'Content-Type':'application/json'
            })
        }
        const response = await fetch(this.APIBase + "foodTrustProduts", params);
        const productsList = await response.json();
        return productsList;
    }

    async foodTrustProductByDesciption(){
        const params = {
            method: 'get',
            headers: new Headers({
                'Content-Type':'application/json'
            })
        }
        const response = await fetch(this.APIBase + "foodTrustProductByDesciption", params);
        const productsList = await response.json();
        return productsList;
    }

    async foodTrustLocations() {
        const params = {
            method: 'post',
            headers: new Headers({
                
                'Content-Type':'application/json'
            })
        }
        const response = await fetch(this.APIBase + "foodTrustLocations", params);
        const locationsList = await response.json();
        return locationsList;
    }

    async foodTrustLocationByOrg(){
        const params = {
            method: 'get',
            headers: new Headers({
                'Content-Type':'application/json'
            })
        }
        const response = await fetch(this.APIBase + "foodTrustLocationsByOrg", params);
        const locationsList = await response.json();
        return locationsList;
    }

    async foodTrustTransaction(requestMap: any){
        const params = {
            method: 'post',
            headers: new Headers({
                
                'Content-Type':'application/json'
            }),
            body: JSON.stringify(requestMap)
        }
        const response = await fetch(this.APIBase + "issueIFTTransaction", params)
        const commissionTx = response.json()
        return commissionTx
    }

    async foodTrustGetEventByAssetId(asset_id: string){
        const params = {
            method: 'get',
            headers: new Headers({
                
                'Content-Type': 'application/json',
                'asset_id': asset_id
            }),
        }
        const response = await fetch(this.APIBase + "getEventByAssetId", params)
        const commissionTx = response.json()
        return commissionTx
    }
}
