// const { CloudantV1 } = require("@ibm-cloud/cloudant");
// const client = CloudantV1.newInstance({});

const plantedCrops = require("../db/cloudant");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const LOT_DB = "lot-areas";
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
        return response.result;
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
        // console.log(response.result.results[0]);
        return response.result.results[0].rows.map(it => it.doc);
    }

    async getAreasInBbox(box) {
        const bbox = `${box.lowerLeft.lat},${box.lowerLeft.lng},${box.upperRight.lat},${box.upperRight.lng}`;
        const result = await client.getGeo({
            db: this.db,
            ddoc: "newGeoIndexDoc",
            index: "newGeoIndex",
            bbox,
            includeDocs: true,
            nearest: true,
            format: "geojson",
        });
        if (result.status >= 400) {
            throw result;
        } else {
            return result.result;
        }
    }

    async getOverallCropDistribution() {
        const response = await client.postView({
            db: LOT_DB,
            ddoc: plantedCrops,
            view: "cropPlantedArea",
            group: true,
            include_docs: true,
        });

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
}

module.exports = LotAreas;
