import { Farmer, FarmerModel } from "./../db/entities/farmer";
import LandAreasService from "./land-areas.service";
const lotAreas = new LandAreasService();

// const APPLICATION_DB = "application-db";
// const db = APPLICATION_DB;

async function getFarmer(id: string) {
    // const response = await client.getDocument({
    //     db,
    //     docId: `farmer:${id}`,
    // });
    // const farmer = response.result;
    // farmer.lots = await lotAreas.getLots(farmer.lot_ids);

    // Aggregate with land areas eventually
    const farmer = await FarmerModel.findById(id).exec();
    if (farmer == null) {
        return null;
    }
    farmer.lands = await lotAreas.getLots(farmer.land_ids);
    return farmer;
}

export class AuthService {

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
        const userDoc: Farmer = {
            type: "farmer",
            name: name,
            password: password,
            mobile: mobileNumber,
            land_ids: []
        };

        const farmerDoc = FarmerModel.create(userDoc);

        return farmerDoc;
    }

    async isUserExists(name) {
        // const user = await client.getDocument({
        //     db,
        //     docId: "farmer:" + name,
        // }).catch(() => {
        //     return null;
        // });

        // return user !== null;
        const docs = await FarmerModel.find({name}).exec();
        return docs.length > 0;
    }

}

// module.exports = AuthService;
