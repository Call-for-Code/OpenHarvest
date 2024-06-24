import axios from 'axios';
import { Field } from '../types/field';
export class FieldAPI{
    APIBase = "/api/fields/";
    
    async getFieldForFarmer(farmer_id: any): Promise<Field> {
        const data = await axios.get<Field>(this.APIBase + "getFieldByFarmerId/" + farmer_id);
        return data.data;
    }
}