const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

class AuthService {

    constructor() {
    }

    async login(name, password) {
        const user = await client.getDocument({
            db,
            docId: "farmer:" + name,
        }).catch(() => {
            return {result: {}};
        });

        return user.result.password === password;
    }

    async register(name, password, mobileNumber) {
        const userDoc = {
            _id: "farmer:" + name,
            type: "farmer",
            name: name,
            password: password,
            mobileNumber: mobileNumber,
        };

        const response = await client.postDocument({
            db,
            document: userDoc,
        });

        return response.result;
    }

    async isUserExists(name) {
        const user = await client.getDocument({
            db,
            docId: "farmer:" + name,
        }).catch(() => {
            return null;
        });

        return user !== null;
    }

}

module.exports = AuthService;
