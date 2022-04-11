
import axios from "axios";

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

