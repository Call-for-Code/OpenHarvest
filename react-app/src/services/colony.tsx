import axios from 'axios';

export class ColonyAPI{
    APIBase = "/api/colony/";
    
    async getReputationForFarmer(field: any): Promise<any> {
        const data = await axios.post(this.APIBase, field);
        console.log(data.data)
        return data.data;
    }
}