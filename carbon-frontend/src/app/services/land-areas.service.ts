import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LatLngBounds } from "leaflet";
import { FeatureCollection } from "geojson";

@Injectable({
  providedIn: 'root'
})
export class LandAreasService {

  constructor(private http: HttpClient) { }

  getLandAreas(bounds: LatLngBounds) {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const bboxStr = `${sw.lat},${sw.lng},${ne.lat},${ne.lng},`
    
    return this.http.get<FeatureCollection>(`http://localhost:3000/land-areas/${bboxStr}`).toPromise();
  }
}
