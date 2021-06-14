import { Controller, Get, Param } from '@nestjs/common';
import { Bbox, LandAreasService } from "./../services/land-areas.service";

@Controller('land-areas')
export class LandAreasController {

    constructor(private landAreasService: LandAreasService) {}

    @Get(":bboxString")
    getLandAreas(@Param("bboxString") bboxStr: string) {
        // bbox String is in the format
        // southwest(lat, lng), northeast(lat, lng)
        console.log(bboxStr);
        const elems = bboxStr.split(",");
        const bbox: Bbox = {
            lowerLeft: {
                lat: elems[0],
                lng: elems[1]
            },
            upperRight: {
                lat: elems[2],
                lng: elems[3]
            },
        }
        console.log(bbox);
        return this.landAreasService.getAreasInBbox(bbox);
        // return "it worked!";
    }

}
