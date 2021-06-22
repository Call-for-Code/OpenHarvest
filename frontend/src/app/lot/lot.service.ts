import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature } from "geojson";

export interface Centre {
	type: "Point";
  /**
   * lng, lat format
   */
	coordinates: [number, number];
}

export interface Crop {
	type: string;
	name: string;
  /**
   * The start and end months
   */
	planting_season: [number, number];
	is_ongoing: string;
	time_to_harvest: number;
  /**
   * yield in kg's per Ha
   */
	yield: number;
}

export interface Crops_planted {
	name: string;
	planted: Date;
	harvested?: any;
	crop: Crop;
}

export type Lot = Feature & {
  _id?: string;
  _rev?: string;
  name: string;
  properties: {
    fid: string;
    Area_Ha: number;
    data: {
      Area_Ha: number;
      centre: Centre;
      crops_planted: Crops_planted[];
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private http: HttpClient) { }

  getLot(id) {
    return this.http.get<Lot>(`/api/lot/${id}`).toPromise();
  }

  getAllLots() {
    return this.http.get<Lot[]>("/api/lot").toPromise();
  }

  addLot(lot: Lot) {
    return this.http.post<Lot>("/api/lot", lot).toPromise();
  }

  updateLot(lot: Lot) {
    return this.http.put<Lot>("/api/lot", lot).toPromise();
  }

  deleteLot(id) {
    return this.http.delete<Lot>(`/api/lot/${id}`).toPromise();
  }
}
