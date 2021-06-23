// const {client, plantedCrops} = require("../db/cloudant");
// const { CloudantV1 } = require("@ibm-cloud/cloudant");
// const client = CloudantV1.newInstance({});

// const { plantedCrops, cropProductionForecast} = require("../db/cloudant");
const {
    client,
    plantedCrops,
    plantedAreaView,
    cropProductionByMonthView,
    cropProductionForecast,
    cropProductionHistory,
    farmerCountDoc,
    farmerCountView,
    cropsPlantedDoc,
    cropsPlantedView,
    cropsHarvestedDoc,
    cropsHarvestedView
} = require("../db/cloudant");
// const { CloudantV1 } = require("@ibm-cloud/cloudant");
// const client = CloudantV1.newInstance({});

const LOT_DB = "lot-areas";
const APPLICATION_DB = "application-db";
const db = LOT_DB;
// const nswBbox = "140.965576,-37.614231,154.687500,-28.071980"; // lng lat
// const nswBboxLatLng = "-37.614231,140.965576,-28.071980,154.687500"; // lat lng

class LotAreas {
    constructor() {}

    async updateLot(lot) {
        const response = await client.putDocument({
            db,
            docId: lot._id,
            document: lot,
        });
        if (response.status >= 400) {
            throw new Error(response);
        }
        return response;
    }

    async getLot(id) {
        const response = await client.getDocument({
            db,
            docId: id,
        });
        if (response.status >= 400) {
            throw new Error(response);
        }
        return response.result;
    }

    async getLots(ids) {
        const response = await client.postAllDocsQueries({
            db,
            queries: [{
                include_docs: true,
                keys: ids,
            }],

        });
        if (response.status >= 400) {
            throw new Error(response);
        }
        return response.result.results[0].rows.map(it => it.doc);
    }

    async getAllLots() {
        const response = await client.postAllDocs({
            db,
            include_docs: true,
            limit: 50,
        });

        if (response.status >= 400) {
            throw new Error(response);
        }

        return response.result.rows.map((row) => {
            return {_id: row.id, name: row.name };
        });
    }

    async getAreasInBbox(box) {
        const bbox = `${box.lowerLeft.lng},${box.lowerLeft.lat},${box.upperRight.lng},${box.upperRight.lat}`;
        const response = await client.getGeoAsStream({
            db,
            ddoc: "newGeoIndexDoc",
            index: "newGeoIndex",
            includeDocs: true,
            nearest: false,
            bbox,
            relation: "intersects",
            format: "geojson",
            limit: 200
        });

        if (response.status >= 400) {
            throw response;
        }

        const stream = response.result;

        let result = "";

        stream.on("data", (data) => {
            result += data.toString();
        });

        return new Promise((resolve) => {
            stream.on("end", () => {
                const parsed = JSON.parse(result);
                console.log(parsed.features.length);
                resolve(parsed);
            });
        });

    }

    async getOverallCropDistribution() {
        const params = {
            db: LOT_DB,
            ddoc: plantedCrops,
            view: plantedAreaView,
            group: true,
            include_docs: true,
        };
        const response = await client.postView(params);

        if (response.status >= 400) {
            throw response;
        } else {
            const rows = response.result.rows;
            return rows.map(row => {
                return {
                    crop: row.key,
                    area: row.value,
                };
            });
        }
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
        const response = await client.postView({
            db: LOT_DB,
            ddoc: cropProductionHistory,
            view: "cropProductionHistoryByMonth",
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
            }).filter(data => new Date(data.date) <= new Date());
        }
    }

    async getViewValue(doc, view, database) {
        const response = await client.postView({
            db: database,
            ddoc: doc,
            view: view
        });

        if (response.status >= 400) {
            throw response;
        } else {
            const rows = response.result.rows;
            return rows[0].value;
        }
    }

    async getTotalFarmers() {
        return this.getViewValue(farmerCountDoc, farmerCountView, APPLICATION_DB);
    }

    async getCropsPlanted() {
        return this.getViewValue(cropsPlantedDoc, cropsPlantedView, LOT_DB);
    }

    async getCropsHarvested() {
        return this.getViewValue(cropsHarvestedDoc, cropsHarvestedView, LOT_DB);
    }

    async getTotalLots() {
        const resp = await client.getDatabaseInformation({
            db: LOT_DB
        });
        return resp.result.doc_count;
    }
}

module.exports = LotAreas;
