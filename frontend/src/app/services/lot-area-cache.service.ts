import { Injectable } from '@angular/core';
import { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import { LandAreasService } from "./land-areas.service";

@Injectable({
  providedIn: 'root'
})
export class LotAreaCacheService {

  accessedBounds

  constructor(private lotAreas: LandAreasService) { }

  // string id array
  cachedAreas: {
    [key: string]: FeatureCollection
  } = {};

  async getAreas(bounds: LatLngBounds) {
    const boundsKey = bounds.toBBoxString();

    if (boundsKey in this.cachedAreas) {
      return this.cachedAreas[boundsKey];
    }

    const areas = await this.lotAreas.getAreasQueued(bounds);
    this.cachedAreas[boundsKey] = areas;

    return areas;
  }
}
