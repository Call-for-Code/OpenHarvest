import { CloudantV1 } from "@ibm-cloud/cloudant";
import { HttpException, Injectable } from '@nestjs/common';
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
        const response = await this.client.getGeoAsStream({
            db: this.db,
            ddoc: "landAreaDesignDoc",
            index: "landAreaGeoIndex",
            includeDocs: true,
            nearest: false,
            bbox,
            relation: "touches",
            format: "geojson"
        });

        if (response.status >= 400) {
            throw new HttpException(JSON.stringify(response), +response.statusText);
        }

        const stream: NodeJS.ReadableStream = response.result as unknown as NodeJS.ReadableStream;

        let result = "";

        stream.on('data', (data: Buffer) => {
            result += data.toString();
        });

        return new Promise((resolve, reject) => {
            stream.on('end', () => {
                // console.log(result);
                resolve(result);
            });
        });
        
    }

}
