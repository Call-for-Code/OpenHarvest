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
}
