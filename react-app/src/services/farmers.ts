import axios from 'axios'

export interface Farmer {
    _id?: string,
    name: string,
    mobile: string[],
    land_ids: string[]
    // lands?: Land[]
}

export async function getAllFarmers(): Promise<Farmer[]> {
    const data = await axios.get<Farmer[]>("/api/farmer/");
    return data.data;
}