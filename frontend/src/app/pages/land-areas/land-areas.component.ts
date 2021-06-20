import { Component, OnInit } from '@angular/core';
import { circle, latLng, layerGroup, MapOptions, polygon, tileLayer, Map, rectangle, geoJSON, LatLng } from "leaflet";

// Import Leaflet Libraries
import virtualGrid from 'leaflet-virtual-grid';
import { LotAreaCacheService } from "./../../services/lot-area-cache.service";

@Component({
  selector: 'app-land-areas',
  templateUrl: './land-areas.component.html',
  styleUrls: ['./land-areas.component.scss']
})
export class LandAreasComponent implements OnInit {


  OSMBaseLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
  ESRISatelliteLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' });

  options: MapOptions = {
    layers: [
      this.OSMBaseLayer,
      this.ESRISatelliteLayer
    ],
    zoom: 14,
    minZoom: 12,
    center: latLng(-33.751244, 141.965266)
  };

  landAreas = geoJSON(undefined, {
    style: {
      fillOpacity: 0.3
    },
    coordsToLatLng: (coords) => {
      // console.log(coords);
      return latLng(coords[1], coords[0]);
    }
  })

  layersControl = {
    baseLayers: {
      'Open Street Map': this.OSMBaseLayer,
      'ESRI Satellite Layer': this.ESRISatelliteLayer,
    },
    overlays: {
      'Land Areas': this.landAreas,
    }
  }

  map: Map;

  // Virtual Grids
  coordsToKey = (coords) => coords.x + ':' + coords.y + ':' + coords.z;

  grid = new virtualGrid({
    cellSize: 512
  });

  rects = {};

  constructor(private lotAreaCache: LotAreaCacheService) {
    console.log("rects", this.rects);
  }

  ngOnInit(): void {
  }

  async onMapMoved(event: any) {
    console.log("Moved", event);
    if (this.map == undefined) {
      return;
    }

    // console.log(this.map.getBounds());
    // return;

    try {
        const areas = await this.lotAreaCache.getAreas(this.map.getBounds());
        console.log(areas);

        if (areas.features.length != 0) {
          this.landAreas.addData(areas);
        }

      }
      catch (e) {
        console.error("Failed to fetch Areas", e);
        return;
      }
  }

  onMapReady(map: Map) {
    this.map = map;


    // when new cells come into view...
    // this.grid.on('cellcreate', async (e) => {
    //   console.log('cellcreate', e);


    //   this.rects[this.coordsToKey(e.coords)] = rectangle(e.bounds, {
    //     color: '#3ac1f0',
    //     weight: 2,
    //     opacity: 0.5,
    //     fillOpacity: 0.25
    //   }).addTo(map);

    //   try {
    //     const areas = await this.landAreasService.getAreasQueued(e.bounds);
    //     console.log(areas);

    //     this.landAreas.addData(areas);
    //   }
    //   catch (e) {
    //     console.error("Failed to fetch Areas", e);
    //     return;
    //   }

    // });

    // this.grid.on('cellenter', (e) => {
    //   console.log('cellenter', e);

    //   var rect = this.rects[this.coordsToKey(e.coords)];
    //   map.addLayer(rect);
    // });

    // this.grid.on('cellleave', (e) => {
    //   console.log('cellleave', e);

    //   var rect = this.rects[this.coordsToKey(e.coords)];
    //   map.removeLayer(rect);
    // });

    // this.grid.addTo(map);

    this.landAreas.addTo(map);
  }

}
