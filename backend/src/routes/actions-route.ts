import { Router, Request, Response } from "express";
// import { ActionsModel } from "db/entities/actions";
import { ActionWeightsModel } from "../db/entities/actionWeights";
// import { GnosisPayloadModel } from "db/entities/gnosisPayloads";

async function createOrUpdateWeights(req: Request, res: Response) {
    const weights = req.body;
    if (!weights) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const weightsDoc = new ActionWeightsModel(weights);
        const updatedDoc = weightsDoc.save();
        res.json(updatedDoc);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

}

const router = Router();

//api to get current weights by farmID
router.get("/getWeightsById", async (req, res) => {
    const weights = await ActionWeightsModel.find({}).lean();
    return res.json(weights)
})

//api to create or update weights
router.put("/manageWeights", createOrUpdateWeights);

//api to get current actions

//api to update current actions

//api to get payloads (all or some)

//api to insert new payloads

// router.put("/foodTrustProduts", async (req, res) => {
//     const products = await api.getProducts();
//     res.json(products)
// })

export default router;
