import { Router, Request, Response } from "express";
import { CropTemplateModel } from "../db/entities/cropTemplate";
import { FieldModel } from "../db/entities/field";
import { FarmerModel } from "../db/entities/farmer";
import { calculatePayment, UpdateReputationActions } from "../integrations/Blockchain/web3/helper-functions";
import { gnosisConnection } from "../integrations/Blockchain/web3/authentication-functions";
import { AwsKmsSigner } from "../integrations/Blockchain/web3/AwsKmsSigner";
import { ColonyNetwork } from '@colony/sdk';
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
async function updateRepActions(req: Request, res: Response) {
  try{
      const [updatedField, cropTemplate, statusUpdated] = UpdateReputationActions(req.body.field,req.body.cropId,req.body.farmer,req.body.actionName,req.body.actionStatus);
      if(statusUpdated){
        const query = {"_id": updatedField._id};
        const update = {$set: {'subFields': updatedField.subFields}}
        const docs = await FieldModel.updateOne(query, update)
        .then(doc => {
            return doc;
          })
          .catch(err => {
            return err;
          })
        
        // Create Payload by calculating the amount of reputation tokens to pay
        const payment = calculatePayment(cropTemplate.action_weights[req.body.actionName], cropTemplate.max_payout);

        // connect to Gnosis network
        const ethers = require('ethers');
        const provider = gnosisConnection();
        const openHarvestSigner = new AwsKmsSigner(process.env.OPEN_HARVEST_KEY_ID!, provider);
        
        // connect OH account to Heifer colony
        const colonyNetwork = new ColonyNetwork(openHarvestSigner);
        const colony = await colonyNetwork.getColony(process.env.HEIFER_COLONY_CONTRACT_ADDRESS!);
        
        // get farmer ethereum account form KMS 
        const farmer = await FarmerModel.findById(updatedField.farmer_id).lean().exec();
        const farmerSigner = new AwsKmsSigner(farmer!.ethKeyID);
        const farmerEthAddress = await farmerSigner.getAddress();
        await colony.pay(farmerEthAddress, ethers.utils.parseUnits(payment.toString()));
        
        res.json(docs);
      }else{
        throw new Error('The request must be made with a different action status than what is existing.');
      }
  }catch (e){
      console.error(e);
      res.status(500).json(e);
  }
}

async function addCropTemplateToField(req: Request, res: Response) {
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
router.put("/updateRepActions", updateRepActions);

//api to create or update weights
router.put("/addCropTemplateToField", addCropTemplateToField);

// return all Fields which have the given crop_id in their subFields.properties.crops
router.get("/getField/:field_id", async (req: Request, res: Response) => {
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
