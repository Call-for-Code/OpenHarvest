import { CloudantV1 } from "@ibm-cloud/cloudant";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

const db = process.env['CLOUDANT_LAND_DATABASE'];

export interface LatLng {
    lat: string | number;
    lng: string | number;
}

export interface Bbox {
    lowerLeft: LatLng;
    upperRight: LatLng
}

@Injectable()
export class LandAreasService {

    private client = CloudantV1.newInstance({});
    db: string;

    constructor(private configService: ConfigService) {
        this.db = this.configService.get<string>("CLOUDANT_LAND_DATABASE");
    }

    async getAreasInBbox(box: Bbox) {
        const bbox = `${box.lowerLeft.lat},${box.lowerLeft.lng},${box.upperRight.lat},${box.upperRight.lng}`
        const result = await this.client.getGeo({
            db: this.db,
            ddoc: "landAreaDesignDoc",
            index: "landAreaGeoIndex",
            bbox,
            includeDocs: true,
            nearest: true,
            format: "geojson"
        });
        if (result.status >= 400) {
            throw result;
        }
        else {
            return result.result;
        }
    }

}
