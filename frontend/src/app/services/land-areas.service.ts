import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LatLngBounds } from "leaflet";
import { FeatureCollection } from "geojson";

export interface RequestQueue {
  promise: {
    resolve: (collection: FeatureCollection) => unknown,
    reject: (e) => unknown
  },
  bounds: LatLngBounds
}

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

@Injectable({
  providedIn: 'root'
})
export class LandAreasService {

  constructor(private http: HttpClient) { }
  

  // Maintain a bounds of data already gathered and return that


  requestQueue: RequestQueue[] = [];
  loopID = null;
  timeoutID = null;

  processing = false;

  startLoop() {
    if (this.processing) {
      return;
    }
    this.processing = true;
    console.log("Start Loop");
    this.process();
    // this.loopID = setInterval(this.process.bind(this), 1000);
  }

  async process() {
    let counter = 1;
    while (this.requestQueue.length != 0) {
      const request = this.requestQueue.shift();
      console.log(`${counter++}/${this.requestQueue.length}`, "Processing:", request);
      // Process Requests
      try {
        const results = await this.getLandAreas(request.bounds);
        request.promise.resolve(results);
      }
      catch (e) {
        request.promise.reject(e);
      }
      await delay(1000);
    }

    this.finishLoop();
  }

  finishLoop() {
    this.processing = false;
    if (this.loopID) {
      clearInterval(this.loopID);
      this.loopID = null;
    }
  }

  

  /**
   * Get land areas in a queue like manner, 
   * @param bounds the bounds of the request
   */
  getAreasQueued(bounds: LatLngBounds) {
    
    const completion = new Promise<FeatureCollection>((resolve, reject) => {
      this.requestQueue.push({ promise: {resolve, reject}, bounds });
    });

    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    
    // Subsequent Calls are debounced
    this.timeoutID = setTimeout(() => {
      this.startLoop();
      this.timeoutID = null;
    }, 200);

    return completion;
  }

  getLandAreas(bounds: LatLngBounds) {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const bboxStr = `${sw.lat},${sw.lng},${ne.lat},${ne.lng},`
    
    return this.http.get<FeatureCollection>(`http://localhost:3000/land-areas/${bboxStr}`).toPromise();
  }
}
