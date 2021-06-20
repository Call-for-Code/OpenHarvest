var express = require("express");
var router = express.Router();

const LotAreaService = require("./../services/lot-areas.service");
const lotAreas = new LotAreaService();

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

module.exports = router;
