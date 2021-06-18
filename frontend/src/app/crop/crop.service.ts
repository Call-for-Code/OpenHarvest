import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "./../../environments/environment";

export interface Crop {
	_id: string;
	_rev: string;
	type: string;
	name: string;
	planting_season: [string, string];
	time_to_harvest: number;
}

@Injectable({
  providedIn: 'root'
})
export class CropService {

  API_URL = environment.production ? "/crop" : "http://localhost:3000/crop";

  constructor(private http: HttpClient) { 

  }

  getAllCrops() {
    return this.http.get<Crop[]>(this.API_URL).toPromise();
  }
}
