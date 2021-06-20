import { Injectable } from '@angular/core';
import { LatLngBounds } from "leaflet";
import { LandAreasService } from "./land-areas.service";

@Injectable({
  providedIn: 'root'
})
export class LotAreaCacheService {
  constructor(private lotAreas: LandAreasService) { }

  // string id array
  cachedAreas: string[] = [];

  async getAreas(bounds: LatLngBounds) {
    const areas = await this.lotAreas.getAreasQueued(bounds);
    areas.features = areas.features.filter(it => !this.cachedAreas.includes((it as any)._id))
    this.cachedAreas = this.cachedAreas.concat(areas.features.map(it => (it as any)._id));
    return areas;
  }
}
