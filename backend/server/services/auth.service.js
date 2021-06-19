const client = require("./../db/cloudant");

const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

class Auth {

    constructor() {
    }

    async login(name, password) {
        const farmers = await client.postPartitionFind({
            db,
            includeDocs: true,
            partitionKey: "farmer",
            selector: {
                name: name,
            },
        });

        console.log(farmers.result);

        return true;
    }

    async register(name, password, mobileNumber) {
        const response = await client.postDocument({
            db,
            document: {
                name: name,
                password: password,
                mobileNumber: mobileNumber,
            },
        });

        return response.result;
    }

}

module.exports = Auth;
