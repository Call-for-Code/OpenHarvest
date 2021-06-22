const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const LotAreaService = require("./lot-areas.service");
const lotAreas = new LotAreaService();

const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

async function getFarmer(id) {
    const response = await client.getDocument({
        db,
        docId: `farmer:${id}`,
    });
    const farmer = response.result;
    farmer.lots = await lotAreas.getLots(farmer.lot_ids);
    return farmer;
}

class AuthService {

    constructor() {
    }

    async login(name, password) {
        const user = await getFarmer(name);

        if (user && user.password === password) {
            return user;
        }
        else {
            return null;
        }
    }

    async register(name, password, mobileNumber) {
        const userDoc = {
            _id: "farmer:" + name,
            type: "farmer",
            name: name,
            password: password,
            mobileNumber: mobileNumber,
            lot_ids: []
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
