import { FarmerModel } from "../db/entities/farmer";
import { Farmer, NewFarmer } from "common-types";
import { farmService } from "./FarmService";

class FarmerService {
    async getFarmers(): Promise<Farmer[]> {
        return  await FarmerModel.find().lean().exec();
    }

    async saveFarmer(newFarmer: NewFarmer): Promise<Farmer> {
        const farmerDoc = new FarmerModel(newFarmer);
        return await farmerDoc.save();
    }

    async getFarmer(id: string): Promise<Farmer | null> {
        const farmer = await FarmerModel.findById(id).lean().exec();
        if (farmer == null) {
            return null;
        }

        // Get Fields
        const farms = await farmService.getFarmerFarms(farmer);

        return {
            ...farmer,
            farms
        };
    }
}


export const farmerService = new FarmerService()
