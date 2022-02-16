import { Router } from "express";
var router = Router();

import RecommendationsService from "../services/recommendations.service";
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


export default router;
