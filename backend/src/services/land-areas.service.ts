import { Land, LandModel } from "../db/entities/land";
import { Types } from 'mongoose';
import { FarmerModel } from "src/db/entities/farmer";
// const nswBbox = "140.965576,-37.614231,154.687500,-28.071980"; // lng lat
// const nswBboxLatLng = "-37.614231,140.965576,-28.071980,154.687500"; // lat lng

export interface LatLng {
    lat: number,
    lng: number
}

export interface BoundingBox {
    lowerLeft: LatLng,
    upperRight: LatLng
}

export default class LandAreasService {
    constructor() {}

    async updateLot(lot: Land) {
        const landModel = new LandModel(lot);

        const savedDoc = await landModel.save();
        return savedDoc;
    }

    getLot(id: string) {
        return LandModel.findById(id);
    }

    getLots(ids: string[]) {
        return LandModel.find({ '_id': { $in: ids } });
    }

    getAllLots() {
        return LandModel.find();
    }

    async getAreasInBbox(box: BoundingBox) {
        // const bbox = `${box.lowerLeft.lng},${box.lowerLeft.lat},${box.upperRight.lng},${box.upperRight.lat}`;
        // const response = await client.getGeoAsStream({
        //     db,
        //     ddoc: "newGeoIndexDoc",
        //     index: "newGeoIndex",
        //     includeDocs: true,
        //     nearest: false,
        //     bbox,
        //     relation: "intersects",
        //     format: "geojson",
        //     limit: 200
        // });

        // if (response.status >= 400) {
        //     throw response;
        // }

        // const stream = response.result;

        // let result = "";

        // stream.on("data", (data) => {
        //     result += data.toString();
        // });

        // return new Promise((resolve) => {
        //     stream.on("end", () => {
        //         const parsed = JSON.parse(result);
        //         console.log(parsed.features.length);
        //         resolve(parsed);
        //     });
        // });
        return [];

    }

    async getOverallCropDistribution() {
        // const params = {
        //     db: LOT_DB,
        //     ddoc: plantedCrops,
        //     view: plantedAreaView,
        //     group: true,
        //     include_docs: true,
        // };
        // const response = await client.postView(params);

        // if (response.status >= 400) {
        //     throw response;
        // } else {
        //     const rows = response.result.rows;
        //     return rows.map(row => {
        //         return {
        //             crop: row.key,
        //             area: row.value,
        //         };
        //     });
        // }
        return [];
    }

    async getCropProductionForecast() {
        const response = await client.postView({
            db: LOT_DB,
            ddoc: cropProductionForecast,
            view: cropProductionByMonthView,
            group: true,
            groupLevel: 2,
        });

        if (response.status >= 400) {
            throw response;
        } else {
            const rows = response.result.rows;
            return rows.map(row => {
                return {
                    date: row.key[0],
                    crop: row.key[1],
                    yield: row.value,
                };
            });
        }
    }

    async getCropProductionHistory() {
        // const response = await client.postView({
        //     db: LOT_DB,
        //     ddoc: cropProductionHistory,
        //     view: "cropProductionHistoryByMonth",
        //     group: true,
        //     groupLevel: 2,
        // });

        // if (response.status >= 400) {
        //     throw response;
        // } else {
        //     const rows = response.result.rows;
        //     return rows.map(row => {
        //         return {
        //             date: row.key[0],
        //             crop: row.key[1],
        //             yield: row.value,
        //         };
        //     }).filter(data => new Date(data.date) <= new Date());
        // }
        return [];
    }

    async getViewValue(doc, view, database) {
        // const response = await client.postView({
        //     db: database,
        //     ddoc: doc,
        //     view: view
        // });

        // if (response.status >= 400) {
        //     throw response;
        // } else {
        //     const rows = response.result.rows;
        //     return rows[0].value;
        // }
        return 0;
    }

    getTotalFarmers() {
        //return this.getViewValue(farmerCountDoc, farmerCountView, APPLICATION_DB);
        return FarmerModel.count().exec();
    }

    async getCropsPlanted() {
        // return this.getViewValue(cropsPlantedDoc, cropsPlantedView, LOT_DB);
        
        // Aggregate of crops planted
        return 0;
    }

    async getCropsHarvested() {
        // return this.getViewValue(cropsHarvestedDoc, cropsHarvestedView, LOT_DB);

        // Aggregate of crops harvested
        return 0;
    }

    getTotalLots() {
        return LandModel.count().exec();
    }
}

// module.exports = LotAreas;
