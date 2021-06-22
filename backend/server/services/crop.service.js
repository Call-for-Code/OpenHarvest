const {client} = require("../db/cloudant");
const {cropDetailsView} = require("../db/cloudant");
const {cropDetailsDdoc} = require("../db/cloudant");

const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

const LOT_DB = "lot-areas";
let cropDetails;

class CropService {

    constructor() {
    }

    async getAllCrops() {
        if (cropDetails) {
            return cropDetails;
        }

        const response = await client.postView({
            db: LOT_DB,
            ddoc: cropDetailsDdoc,
            view: cropDetailsView,
            group: true,
        });

        cropDetails = response.result.rows.map(v => v.value);

        return cropDetails;
    }

    async saveOrUpdate(crop) {
        const response = await client.postDocument({
            db,
            document: crop,
        });

        return response.result;
    }

    async getCrop(id) {
        const response = await client.getDocument({
            db,
            docId: `${id}`,
        });

        return response.result;
    }

    async deleteCrop(id) {
        const doc = await this.getCrop(id);

        const response = await client.deleteDocument({
            db,
            docId: `${doc._id}`,
        });

        return response.result;
    }
}

module.exports = CropService;
