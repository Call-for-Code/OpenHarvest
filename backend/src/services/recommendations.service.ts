// const {client, plantedCrops} = require("../db/cloudant");
// const { CloudantV1 } = require("@ibm-cloud/cloudant");
// const client = CloudantV1.newInstance({});

// const { plantedCrops, cropProductionForecast} = require("../db/cloudant");
import LandAreasService from "./land-areas.service";
import CropService from "./crop.service";

// const nswBbox = "140.965576,-37.614231,154.687500,-28.071980"; // lng lat
// const nswBboxLatLng = "-37.614231,140.965576,-28.071980,154.687500"; // lat lng
const weights = {
    lowPlantedArea: 0.15,
    lowYieldForecast: 0.20,
    onShortlist: 0.25,
    inSeason: 0.40,
    // notOnOthersShortlist: 0.30,
};

export class RecommendationsService {
    constructor() {
        this.lotAreaService = new LandAreasService();
        this.cropService = new CropService();
    }

    async getRecommendations(request) {
        this.createOrUpdateShortlistForLot(request);
        const cropDetails = await this.cropService.getAllCrops();

        const plantDate = new Date(request.plantDate);
        const plantMonth = plantDate.getMonth() + 1;
        const crops = {};

        cropDetails.forEach(crop => {
            // const crop = row.value;
            const seasonStartMonth = crop.planting_season[0];
            let inSeason = false;
            let seasonEndMonth = crop.planting_season[1];
            if (seasonStartMonth > seasonEndMonth) {
                inSeason = (plantMonth >= seasonStartMonth && plantMonth <= 12) || (plantMonth >= 1 && plantMonth <= seasonEndMonth);
            } else {
                inSeason = plantMonth >= seasonStartMonth && plantMonth <= seasonEndMonth;
            }
            crops[crop.name.toLowerCase()] = {
                shortlist: 0,
                area: 0,
                yield: 0,
                season: crop.planting_season,
                inSeason: inSeason ? 100 : 0,
                harvestStart: new Date(plantDate.getDate() + crop.time_to_harvest - 30),
                harvestEnd: new Date(plantDate.getDate() + crop.time_to_harvest + 30),
            };
        });

        request.crops.forEach(crop => {
            crops[crop.toLowerCase()].shortlist = 100;
        });

        const overallCropDistribution = await this.lotAreaService.getOverallCropDistribution();
        const minArea = Math.min(...overallCropDistribution.map(dist => dist.area));

        overallCropDistribution.forEach((dist) => {
            if (crops[dist.crop.toLowerCase()]) {
                crops[dist.crop.toLowerCase()].area = dist.area;
            }
        });

        const cropProductionForecast = await this.lotAreaService.getCropProductionForecast();
        cropProductionForecast.forEach((dist) => {
            const harvestDate = new Date(dist.date);
            const crop = crops[dist.crop.toLowerCase()];
            if (harvestDate <= crop.harvestEnd && harvestDate >= crop.harvestStart) {
                crop.yield += dist.yield;
            }
        });
        const minYield = Math.min(...cropDetails.map(crop => crops[crop.name.toLowerCase()].yield));

        const cropScores = [];

        cropDetails.forEach((cropDetail) => {
            const crop = crops[cropDetail.name.toLowerCase()];
            const cropScore = {};
            cropScore.crop = cropDetail.name;
            cropScore.shortlistScore = crop.shortlist / 100 * weights.onShortlist;
            cropScore.inSeasonScore = crop.inSeason / 100 * weights.inSeason;
            cropScore.plantedAreaScore = crop.area === 0 ? 0 : (minArea / crop.area * weights.lowPlantedArea);
            cropScore.yieldForecastScore = crop.yield === 0 ? 0 : (minYield / crop.yield * weights.lowYieldForecast);
            cropScore.score = 10 * (cropScore.shortlistScore +
                cropScore.inSeasonScore +
                cropScore.plantedAreaScore +
                cropScore.yieldForecastScore);
            cropScores.push(cropScore);
        });

        return cropScores.sort((a, b) => b.score - a.score);
    }

    createOrUpdateShortlistForLot(request) {
        // TODO save or update to lot
    }
}

module.exports = RecommendationsService;
