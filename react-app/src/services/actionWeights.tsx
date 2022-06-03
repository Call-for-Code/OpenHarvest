import axios from 'axios'
// import { EISField, FieldResponse } from '../types/EIS';

export interface ActionWeights {
    _id?: string,
    action_a_weight: number,
    action_b_weight: number,
    action_c_weight: number,
    action_d_weight: number,
    crop_template_id: string
}


export class ActionWeightsAPI{
    APIBase = "/api/weights/";
    
    async getAllActionWeights(): Promise<ActionWeights> {
        const data = await axios.get<ActionWeights>(this.APIBase + "getWeights");
        return data.data;
    }

    async getActionWeightsById(cropTemplateId: string): Promise<ActionWeights> {
        const data = await axios.get<ActionWeights>(this.APIBase + "getWeightsById/" + cropTemplateId);
        return data.data;
    }
    
    async deleteActionWeightsById(cropTemplateId: string): Promise<ActionWeights> {
        const data = await axios.delete<ActionWeights>(this.APIBase + "deleteWeightsById/" + cropTemplateId);
        return data.data;
    }

    async putActionWeights(actionWeightsObject: ActionWeights): Promise<ActionWeights> {
        const data = await axios.put<ActionWeights>(this.APIBase + "put", actionWeightsObject);
        return data.data
    }
}