import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { circle, latLng, layerGroup, MapOptions, polygon, tileLayer, Map, rectangle, geoJSON, LatLng, latLngBounds, LatLngBounds } from "leaflet";
import squareGrid from "@turf/square-grid";

// Import Leaflet Libraries
import { LotAreaCacheService } from "./../../services/lot-area-cache.service";
import { nswMask } from "./masks";
import { Feature, Polygon } from "geojson";
import { Lot } from "./../../lot/lot.service";

@Component({
  selector: 'app-land-areas',
  templateUrl: './land-areas.component.html',
  styleUrls: ['./land-areas.component.scss']
})
export class LandAreasComponent implements OnInit {


  @Output() featureClick = new EventEmitter<Lot>();

  OSMBaseLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
  ESRISatelliteLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' });

  bboxGridGeojson = squareGrid([140.822754, -37.579413, 153.830566, -28.091366], 50, {
    mask: nswMask as Feature<Polygon>
  });

  bboxGridBounds = this.bboxGridGeojson.features.map(it => {
    const sw = it.geometry.coordinates[0][0];
    const ne = it.geometry.coordinates[0][2];
    return latLngBounds({
      lat: sw[1],
      lng: sw[0]
    }, {
      lat: ne[1],
      lng: ne[0]
    })
  });

  // leafletGridGeoJSON = geoJSON(this.bboxGridGeojson, {
  //   style: {
  //     fillOpacity: 0.1
  //   }
  // });

  exploredBounds: LatLngBounds;
  savedLots: string[] = [];

  options: MapOptions = {
    layers: [
      this.OSMBaseLayer
    ],
    zoom: 14,
    minZoom: 10,
    center: latLng(-33.751244, 141.965266)
  };

  landAreas = geoJSON(undefined, {
    style: {
      fillOpacity: 0.3
    },
    coordsToLatLng: (coords) => {
      // console.log(coords);
      return latLng(coords[1], coords[0]);
    },
    onEachFeature: (feature, layer) => {
      layer.on('click', (e) => {
        // console.log(feature);
        this.zone.run(() => {
          this.featureClick.emit(feature as any);
        })
      });
    }
  })

  layersControl = {
    baseLayers: {
      'Open Street Map': this.OSMBaseLayer,
      'ESRI Satellite Layer': this.ESRISatelliteLayer,
    },
    overlays: {
      'Land Areas': this.landAreas,
      // 'Grid Areas': this.leafletGridGeoJSON
    }
  }

  map: Map;

  // Grid Handling Code

  

  constructor(private lotAreaCache: LotAreaCacheService, private zone: NgZone) { }

  ngOnInit(): void {
  }

  async onMapMoved() {
    // console.log("Moved", event);
    if (this.map == undefined) {
      return;
    }

    const bounds = this.map.getBounds();

    if (this.exploredBounds.contains(bounds)) {
      return;
    }

    this.exploredBounds.extend(bounds);

    const intersectingGrids = this.bboxGridBounds.filter(it => bounds.intersects(it));
    // console.log(intersectingGrids);

    // console.log(this.map.getBounds());
    // return;

    

    try {
      const promises = intersectingGrids.map(it => this.lotAreaCache.getAreas(it));
      const areas = await Promise.all(promises);
      // console.log(areas);

      for (const area of areas) {
        if (area.features.length !== 0) {
          // Filter out already rendered lots
          area.features = area.features.filter(it => !this.savedLots.includes(it.properties.fid));
          const newLots = area.features.map(it => it.properties.fid);
          this.savedLots = this.savedLots.concat(newLots);

          // console.log(newLots, this.savedLots);

          this.landAreas.addData(area);
        }
      }

    }
    catch (e) {
      console.error("Failed to fetch Areas", e);
      return;
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    this.landAreas.addTo(map);
    this.exploredBounds = map.getBounds();


    this.onMapMoved();


    

    // console.log(this.bboxGridGeojson.features);

    // this.leafletGridGeoJSON.addTo(map);


    

    
  }

}
