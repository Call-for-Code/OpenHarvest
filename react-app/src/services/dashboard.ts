

import axios from 'axios'

export interface YeildData {
    group : string,
    category: string,
    value: number
    // lands?: Land[]
}

export async function getDashboard(): Promise<YeildData[]> {
    const data = await axios.get<YeildData[]>("/api/dashboard/tiles/");
    return data.data;
}

