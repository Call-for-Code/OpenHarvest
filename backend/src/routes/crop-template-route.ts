import { Router, Request, Response } from "express";
import { CropTemplateModel } from "../db/entities/cropTemplate";
import { FieldModel } from "../db/entities/field"
import { Crop } from "../db/entities/crop"
import { Schema, model, ObjectId, Types, isObjectIdOrHexString } from 'mongoose';

const router = Router();

async function createOrUpdateCropTemplates(req: Request, res: Response) {
    try{
        const query = {"crop_template_name": req.body.crop_template_name};
        const update = {$set: req.body}
        const options = {upsert: true}
        const docs = await CropTemplateModel.updateOne(query, update, options)
        .then(doc => {
            return doc;
          })
          .catch(err => {
            return err;
          })
        res.json(docs);
    }catch (e){
        console.error(e);
        res.status(500).json(e);
    }
}

//api to create or update weights
router.put("/updateCropTemplate", createOrUpdateCropTemplates);

// return all ActionCropTemplates from mongoDB
router.get("/getCropTemplates", async (req: Request, res: Response) => {
    try {
        const docs = await CropTemplateModel.find({})
        .then(doc => {
           return doc;
          })
          .catch(err => {
           return err;
          })
        res.json(docs);
        
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
  });

// return all ActionWeight for a given crop template ID
router.get("/getCropTemplateByName/:crop_template_name", async (req: Request, res: Response) => {
    try {
        const docs = await CropTemplateModel.find({"crop_template_name": req.params.crop_template_name})
        .then(doc => {
            return doc
          })
          .catch(err => {
            return err
          })
        res.json(docs);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

// delete ActionWeight by given crop template ID
router.delete("/deleteCropTemplateByName/:crop_template_name", async (req: Request, res: Response) => {
    try {
        const docs = await CropTemplateModel.deleteOne({"crop_template_name": req.params.crop_template_name})
        .then(doc => {
            return doc;
          })
          .catch(err => {
            return err;
          })
        res.json(docs);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

// return all Fields which have the given crop_id in their subFields.properties.crops
router.get("/getFieldsforCropId/:crop_id", async (req: Request, res: Response) => {
  try {
    const docs = await FieldModel.find({
      "subFields.properties.crops.crop._id": req.params.crop_id
    })
    .then(doc => {
       return doc;
      })
      .catch(err => {
       return err;
      })
    res.json(docs);
    
} catch (e) {
    console.error(e);
    res.status(500).json(e);
}
});

// first lookup the field ID and if found replace its subfields with subfields
// data from the incoming payload. This will set the crop_template and reputation actions
async function createOrUpdateField(req: Request, res: Response) {
  try{
      const query = {"_id": req.body._id};
      const update = {$set: {'subFields': req.body.subFields}}
      const docs = await FieldModel.updateOne(query, update)
      .then(doc => {
          return doc;
        })
        .catch(err => {
          return err;
        })
      res.json(docs);
  }catch (e){
      console.error(e);
      res.status(500).json(e);
  }
}

//api to create or update weights
router.put("/updateField", createOrUpdateField);

// return all Fields which have the given crop_id in their subFields.properties.crops
router.get("/getActionsForField/:field_id", async (req: Request, res: Response) => {
  try {
    const docs = await FieldModel.findById(req.params.field_id)
    .then(doc => {
       return doc;
      })
      .catch(err => {
       return err;
      })
    res.json(docs);
    
  } catch (e) {
      console.error(e);
      res.status(500).json(e);
  }
});

export default router;
