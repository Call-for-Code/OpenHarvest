const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

class CropService {

    constructor() {
    }

    async getAllCrops() {
        const response = await client.postPartitionAllDocs({
            db,
            includeDocs: true,
            partitionKey: "crop",
        });

        return response.result;
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
