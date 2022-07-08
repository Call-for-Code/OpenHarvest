import axios from 'axios';
import { Field } from '../../../backend/src/db/entities/field';

export class ColonyAPI{
    APIBase = "/api/colony/";
    
    async getReputationForFarmer(field: Field): Promise<any> {
        const data = await axios.post(this.APIBase, field);
        console.log(data.data)
        return data.data;
    }
}