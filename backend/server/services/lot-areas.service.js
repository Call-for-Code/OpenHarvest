// const { CloudantV1 } = require("@ibm-cloud/cloudant");
// const client = CloudantV1.newInstance({});

const client = require("./../db/cloudant");

const LOT_DB = "lot-areas";
const db = LOT_DB;

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
        const result = await this.client.getGeo({
            db: this.db,
            ddoc: "newGeoIndexDov",
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
        const result = await this.client.getGeo({
            db: this.db,
            ddoc: "newGeoIndexDov",
            index: "newGeoIndex",
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
}

module.exports = LotAreas;
