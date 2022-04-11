
import axios from "axios";


//Pi graphs - Dashboard UI
export interface YeildData {
    group : string;
    category: string;
    value: number;
    // lands?: Land[]
}
export interface TileDTO {
    yeild: YeildData[];
    nutType: YeildData[];
}


export async function getDashboard(): Promise<TileDTO> {
    const data = await axios.get<TileDTO>("/api/dashboard/tiles/");
    return data.data;
}




//Data cards - dashboard UI
export interface CardData{
    value : number;
}

export interface Cards {
    totCrops: CardData;
    totFarmers: CardData;
    totLand: CardData;
    totPrecip: CardData;
}


export async function getDashboardCards(): Promise<Cards> {
    const data = await axios.get<Cards>("/api/dashboard/tiles/");
    return data.data;
}

