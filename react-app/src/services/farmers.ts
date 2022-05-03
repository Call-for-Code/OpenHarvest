import axios from 'axios'
import { EISField, FieldResponse } from '../types/EIS';

export interface Farmer {
    _id?: string,
    name: string,
    mobile: string,
    address: string,
    coopOrganisations: string[],
    fieldCount: number;
    field?: FieldResponse;
}

export interface FarmerAddDTO {
    farmer: Farmer;
    field: EISField;
}

export async function getAllFarmers(): Promise<Farmer[]> {
    const data = await axios.get<Farmer[]>("/api/farmer/");
    return data.data;
}

export async function getFarmer(farmer_id: string): Promise<Farmer> {
    const data = await axios.get<Farmer>(`/api/farmer/${farmer_id}`);
    return data.data;
}

export async function addFarmer(farmer: FarmerAddDTO): Promise<Farmer> {
    const data = await axios.post<Farmer>("/api/farmer/add", farmer);
    return data.data
}