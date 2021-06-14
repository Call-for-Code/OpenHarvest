import { Component, OnInit } from '@angular/core';
import { circle, latLng, layerGroup, MapOptions, polygon, tileLayer, Map, rectangle, geoJSON } from "leaflet";

// Import Leaflet Libraries
import virtualGrid from 'leaflet-virtual-grid';
import { LandAreasService } from "./../../services/land-areas.service";

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
      // this.ESRISatelliteLayer
    ],
    zoom: 10,
    minZoom: 8,
    center: latLng(-34.615870, 143.585049)
  };

  landAreas = geoJSON()

  layersControl = {
    baseLayers: {
      // 'ESRI Satellite Layer': this.ESRISatelliteLayer,
      'Open Street Map': this.OSMBaseLayer,
    },
    overlays: {
      'Land Areas': this.landAreas,
    }
  }

  // Virtual Grids
  coordsToKey = (coords) => coords.x + ':' + coords.y; // + ':' + coords.z;

  grid = new virtualGrid({
    cellSize: 1024
  });

  rects = {};

  constructor(private landAreasService: LandAreasService) {
    console.log("rects", this.rects);
  }

  ngOnInit(): void {
  }

  onMapReady(map: Map) {
    // when new cells come into view...
    this.grid.on('cellcreate', async (e) => {
      console.log('cellcreate', e);

      try {
        const areas = await this.landAreasService.getLandAreas(e.bounds);
        console.log(areas);

        this.landAreas.addData(areas);
      }
      catch (e) {
        console.error("Failed to fetch Areas", e);
        return;
      }

      // this.rects[this.coordsToKey(e.coords)] = rectangle(e.bounds, {
      //   color: '#3ac1f0',
      //   weight: 2,
      //   opacity: 0.5,
      //   fillOpacity: 0.25
      // }).addTo(map);


    });

    this.grid.on('cellenter', (e) => {
      console.log('cellenter', e);

      // var rect = this.rects[this.coordsToKey(e.coords)];
      // map.addLayer(rect);
    });

    this.grid.on('cellleave', (e) => {
      console.log('cellleave', e);

      // var rect = this.rects[this.coordsToKey(e.coords)];
      // map.removeLayer(rect);
    });

    this.grid.addTo(map);

    this.landAreas.addTo(map);
  }

}
