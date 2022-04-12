
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


//bar charts

//temperature over time
export interface TempData {
    month : string;
    temperature: number;
}

//preciptiaton over time
export interface PrecipData {
    month : string;
    precipitation: number;
}

export interface BarData {
    temp: TempData[];
    precip:PrecipData[];

}

export async function getDashboardPrecipBar(): Promise<BarData> {
    const data = await axios.get<BarData>("/api/dashboard/tiles/");
    return data.data;
}



export async function getDashboardTempBar(): Promise<BarData> {
    const data = await axios.get<BarData>("/api/dashboard/tiles/");
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


//data tables
export interface TableValues {
    crop: string;
    area: number;
    oneMonth: number;
    twoMonth: number;
    threeMonth: number;
}

export interface TableData {
    id : string;
    values: TableValues[];
}
export interface DataTable {
    YieldForecast: TableData[];
    YieldHistory: TableData[];
}


export async function getDashboardDataTable(): Promise<DataTable> {
    const data = await axios.get<DataTable>("/api/dashboard/tiles/");
    return data.data;
}
