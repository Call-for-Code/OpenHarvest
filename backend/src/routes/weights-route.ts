import { Router, Request, Response } from "express";
// import { ActionsModel } from "db/entities/actions";
import { ActionWeightsModel } from "../db/entities/actionWeights";
// import { GnosisPayloadModel } from "db/entities/gnosisPayloads";

const router = Router();

async function createOrUpdateWeights(req: Request, res: Response) {
    try{
        const query = {"crop_template_id": req.body.cropTemplateId};
        const update = {$set: req.body}
        const options = {upsert: true}
        const docs = await ActionWeightsModel.updateOne(query, update, options)
        .then(doc => {
            console.log(doc)
          })
          .catch(err => {
            console.error(err)
          })
        res.json(docs);
    }catch (e){
        console.error(e);
        res.status(500).json(e);
    }
}

//api to create or update weights
router.put("/put", createOrUpdateWeights);

// return all ActionWeights from mongoDB
router.get("/getWeights"), async (req: Request, res: Response) => {
    try {
        const docs = await ActionWeightsModel.find({})
        .then(doc => {
            console.log(doc)
          })
          .catch(err => {
            console.error(err)
          })
        res.json(docs);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
}

// return all ActionWeight for a given crop template ID
router.get("/getWeightsById/:cropTemplateId", async (req: Request, res: Response) => {
    try {
        const docs = await ActionWeightsModel.find({"crop_template_id": req.params.cropTemplateId})
        .then(doc => {
            console.log(doc)
          })
          .catch(err => {
            console.error(err)
          })
        res.json(docs);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

// delete ActionWeight by given crop template ID
router.delete("/deleteWeightsById/:cropTemplateId", async (req: Request, res: Response) => {
    try {
        const docs = await ActionWeightsModel.deleteOne({"crop_template_id": req.params.cropTemplateId})
        .then(doc => {
            console.log(doc)
          })
          .catch(err => {
            console.error(err)
          })
        res.json(docs);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

//api to get current actions

//api to update current actions

//api to get payloads (all or some)

//api to insert new payloads

// router.put("/foodTrustProduts", async (req, res) => {
//     const products = await api.getProducts();
//     res.json(products)
// })

export default router;
