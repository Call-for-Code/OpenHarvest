import axios from 'axios'

export interface Crop {
    _id: string;
    name: string;
    planting_season: number[],
    time_to_harvest: number,
    is_ongoing: boolean,
    yield_per_sqm: number
}


export async function getAllCrops(): Promise<Crop[]> {
    const data = await axios.get<Crop[]>("/api/crop/");
    return data.data;
}