// import dependencies and initialize the express router
import { Router } from "express";
import { FoodTrustAPI } from "../integrations/Blockchain/food-trust/food-trust-api.service";

const router = Router();

const api = new FoodTrustAPI();

router.post("/foodTrustProduts", async (req, res) => {
    const products = await api.getProducts();
    res.json(products)
})

router.get("/foodTrustProductByDesciption", async (req, res) => {
    const products = await api.getProductsByDescription();
    res.json(products)
})

router.post("/foodTrustLocations", async (req, res) => {
    const locations = await api.getLocations();
    res.json(locations)
})

router.get("/foodTrustLocationsByOrg", async (req, res) => {
    const locations = await api.getLocationsByOrg();
    res.json(locations)
})

router.post("/issueIFTTransaction", async (req, res) => {
    const commissionTx = await api.issueIFTTransaction(req.body);
    res.json(commissionTx)
})

router.get("/getEventByAssetId", async (req, res) => {
    const eventData = await api.getEventByAssetId(req.headers.asset_id);
    res.json(eventData)
})

export default router;
