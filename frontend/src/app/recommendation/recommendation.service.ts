import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Recommendation {
  lotId?: string,
  cropId?: string,
  cropIds?: string[]
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(protected http: HttpClient) { }

  recommend(request: Recommendation) {
    //Make http call here
  }
}