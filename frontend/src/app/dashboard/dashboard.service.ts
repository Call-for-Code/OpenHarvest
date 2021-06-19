import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface CropDistribution {
    crop: string;
    area: number;
    distribution: number;
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
}
