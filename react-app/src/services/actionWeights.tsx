import axios from 'axios'
// import { EISField, FieldResponse } from '../types/EIS';

export interface ActionWeights {
    _id?: string,
    action_a_weight: number,
    action_b_weight: number,
    action_c_weight: number,
    action_d_weight: number
}

export interface AddActionWeights {
    weights: ActionWeights;
    field: string;
}

export async function getActionWeightsById(): Promise<ActionWeights> {
    const data = await axios.get<ActionWeights>("/api/getWeightsById/");
    return data.data;
}

export async function addActionWeights(farmer: AddActionWeights): Promise<ActionWeights> {
    const data = await axios.post<ActionWeights>("/api/weights/add", farmer);
    return data.data
}