import { EISConfig, Farm, Farmer, isDefined, NewFarm } from "../../../common-types/src";
import { FarmModel } from "../db/entities/farm";
import { eisFarmService } from "../integrations/EIS/EISFarmService";
import { organisationService } from "./OrganisationService";

export interface IFarmService {
    getFarmerFarms(farmer: Farmer): Promise<Farm[]>;
    saveFarm(farmer: Farmer, newFarm: NewFarm): Promise<Farm>;
    saveFarms(farmer: Farmer, newFarms: NewFarm[]): Promise<Farm[]>;
}

class FarmService implements IFarmService {

    async getFarmerFarms(farmer: Farmer): Promise<Farm[]> {
        const eisConfig = await FarmService.getEISConfig(farmer.organisation);

        if (isDefined(eisConfig)) {
            return await eisFarmService.getFarmerFarms(eisConfig, farmer);
        }

        return await FarmModel.find({"farmer._id": farmer._id}).exec() as Farm[];
    }

    async saveFarm(farmer: Farmer, newFarm: NewFarm): Promise<Farm> {

        const eisConfig = await FarmService.getEISConfig(farmer.organisation);

        if (isDefined(eisConfig)) {
            return await eisFarmService.saveFarm(eisConfig, farmer, newFarm);
        }

        const farmDoc = new FarmModel(newFarm);
        return await farmDoc.save() as Farm;
    }

    async saveFarms(farmer: Farmer, newFarms: NewFarm[]): Promise<Farm[]> {
        const eisConfig = await FarmService.getEISConfig(farmer.organisation);
        const farms: Farm[] = [];
        for (const newFarm of newFarms) {
            let farm: Farm;
            if (isDefined(eisConfig)) {
                farm = await eisFarmService.saveFarm(eisConfig, farmer, newFarm);
            } else {
                farm = await this.saveFarm(farmer, newFarm) as Farm;
            }
            farms.push(farm);
        }

        return farms;
    }

    private static async getEISConfig(org: string): Promise<EISConfig | undefined> {
        return organisationService.getEISConfig(org);
    }

}

export const farmService = new FarmService();

