import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface Recommendation {
  plantDate: Date;
  crops: string[];
}

export interface CropRecommendationResult {
  crop: string;
  score: number;
  shortlistScore: number;
  inSeasonScore: number;
  plantedAreaScore: number;
  yieldForecastScore: number;
}

@Injectable({
  providedIn: "root"
})
export class RecommendationService {

  constructor(protected http: HttpClient) { }

  recommend(request: Recommendation) {
    return this.http.post<CropRecommendationResult[]>("/api/recommendations", request).toPromise();
  }
}
