import { Router } from "express";
var router = Router();

import LandAreasService from "../services/land-areas.service";
const lotAreas = new LandAreasService();

router.get("/crop-distribution", async(req, res) => {
    try {
        const cropDistribution = await lotAreas.getOverallCropDistribution();
        res.json(cropDistribution);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/crop-production-forecast", async(req, res) => {
    try {
        const cropProductionForecast = await lotAreas.getCropProductionForecast();
        res.json(cropProductionForecast);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/crop-production-history", async(req, res) => {
    try {
        const cropProductionHistory = await lotAreas.getCropProductionHistory();
        res.json(cropProductionHistory);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/tiles", async (req, res) => {
    try {
        const resObj: any = {};
        resObj.totalFarmers = await lotAreas.getTotalFarmers();
        resObj.cropsPlanted = await lotAreas.getCropsPlanted();
        resObj.cropsHarvested = await lotAreas.getCropsHarvested();
        resObj.totalLots = await lotAreas.getTotalLots();
        res.json(resObj);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
    
});

export default router;
