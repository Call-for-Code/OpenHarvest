import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

export interface Crop {
	_id: string;
	_rev?: string;
	type: string;
	name: string;
	planting_season: string[];
	time_to_harvest: number;
  yield?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CropService {

  constructor(private http: HttpClient) {

  }

  getCrop(id) {
    return this.http.get<Crop>(`/api/crop/${id}`).toPromise();
  }

  getAllCrops() {
    return this.http.get<Crop[]>("/api/crop").toPromise();
  }

  addCrop(crop: Crop) {
    return this.http.post<Crop>("/api/crop", crop).toPromise();
  }

  updateCrop(crop: Crop) {
    return this.http.put<Crop>("/api/crop", crop).toPromise();
  }

  deleteCrop(id) {
    return this.http.delete<Crop>(`/api/crop/${id}`).toPromise();
  }
}
