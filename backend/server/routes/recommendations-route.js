var express = require("express");
var router = express.Router();

const RecommendationsService = require("../services/recommendations.service");
const recommendationsService = new RecommendationsService();
router.post("/", async(req, res) => {
    try {
        const recommendations = await recommendationsService.getRecommendations(req.body);
        res.json(recommendations);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});


module.exports = router;
