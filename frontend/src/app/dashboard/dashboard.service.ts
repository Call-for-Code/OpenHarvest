import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface CropDistribution {
    crop: string;
    area: number;
    distribution: number;
}

export interface CropProductionForecast {
    crop: string;
    date: Date;
    yield: number;
}

export interface CropProductionHistory {
    crop: string;
    date: Date;
    yield: number;
}


export interface TileData {
	totalFarmers?: number;
	cropsPlanted?: number;
	cropsHarvested?: number;
	totalLots?: number;
}

@Injectable({
    providedIn: "root"
})
export class DashboardService {

    constructor(private http: HttpClient) {

    }

    getCropDistribution() {
        return this.http.get<CropDistribution[]>("/api/dashboard/crop-distribution").toPromise();
    }

    getCropProductionForecast() {
        return this.http.get<CropProductionForecast[]>("/api/dashboard/crop-production-forecast").toPromise();
    }

    getCropProductionHistory() {
        return this.http.get<CropProductionForecast[]>("/api/dashboard/crop-production-history").toPromise();
    }

    getTileData() {
        return this.http.get<TileData>("/api/dashboard/tiles").toPromise();
    }
}
