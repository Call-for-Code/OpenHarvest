import { Router, Request, Response } from "express";
import { CropTemplateModel } from "../db/entities/cropTemplate";

const router = Router();

async function createOrUpdateCropTemplates(req: Request, res: Response) {
    try{
        const query = {"crop_template_name": req.body.cropTemplateName};
        const update = {$set: req.body}
        const options = {upsert: true}
        const docs = await CropTemplateModel.updateOne(query, update, options)
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
router.put("/put", createOrUpdateCropTemplates);

// return all ActionCropTemplates from mongoDB
router.get("/getCropTemplates"), async (req: Request, res: Response) => {
    try {
        const docs = await CropTemplateModel.find({})
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
router.get("/getCropTemplatesByName/:cropTemplateName", async (req: Request, res: Response) => {
    try {
        const docs = await CropTemplateModel.find({"crop_template_name": req.params.cropTemplateName})
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
router.delete("/deleteCropTemplatesByName/:cropTemplateName", async (req: Request, res: Response) => {
    try {
        const docs = await CropTemplateModel.deleteOne({"crop_template_name": req.params.cropTemplateName})
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

export default router;
