import { Router } from "express";
import RecommendationsService from "../services/recommendations.service";

var router = Router();

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
