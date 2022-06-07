import { Router, Request, Response } from "express";
import { EISField } from "../integrations/EIS/EIS.types";
import { EISAPIService } from "../integrations/EIS/EIS-api.service";
import { Farmer, FarmerModel } from "../db/entities/farmer";
import LandAreasService from "../services/land-areas.service";

// const LotAreaService = require("./../services/lot-areas.service");
// const lotAreas = new LandAreasService();

const EISKey = process.env.EIS_apiKey;

if (EISKey == undefined) {
    console.error("You must define 'EIS_apiKey' in the environment!");
    process.exit(-1);
}

const eisAPIService = new EISAPIService(EISKey);

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const docs = await FarmerModel.find().lean().exec();
        res.json(docs);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

async function createOrUpdateFarmer(req: Request, res: Response) {
    const farmer = req.body;
    if (!farmer) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const farmerDoc = new FarmerModel(farmer);
        const updatedDoc = farmerDoc.save();
        res.json(updatedDoc);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

}

async function getFarmer(id: string) {
    // Aggregate with land areas eventually
    const farmer = await FarmerModel.findById(id).lean().exec();
    if (farmer == null) {
        return null;
    }
    
    // Get Fields
    const field = await eisAPIService.getFarmerField(id);

    return farmer;
}

router.post("/", createOrUpdateFarmer);

router.put("/", createOrUpdateFarmer);

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }

    try {
        const farmer = getFarmer(id);
        if (farmer == null) {
            res.status(404).end();
        }
        else {
            res.json(farmer);
        }
        
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

// Delete Farmer
router.delete("/:id", async(req: Request, res: Response) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const result = await FarmerModel.deleteOne({_id: id});
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

export interface FarmerAddDTO {
    farmer: Farmer;
    field: EISField
}

router.post("/add", async(req: Request, res: Response) => {
    const {farmer, field}: FarmerAddDTO = req.body;
    if (farmer == undefined) {
        res.status(400).send("Farmer not defined");
        return;
    }
    if (field == undefined) {
        res.status(400).send("Field not defined");
        return;
    }
    // First we'll create the farmer
    const farmerDoc = new FarmerModel(farmer);
    const newFarmer = await farmerDoc.save();

    if (newFarmer._id == undefined) {
        throw new Error("Farmer ID is not defined after saving!")
    }

    // Then we'll create the Field
    
    // We have to set the farmer ID on the field first
    for (let i = 0; i < field.subFields.length; i++) {
        const properties = field.subFields[i].geo.geojson.features[0].properties;
        properties.open_harvest_farmer_id = newFarmer._id!!.toString();
        properties.open_harvest.farmer_id = newFarmer._id!!.toString();
    }

    const createdFieldsUuids = await eisAPIService.createField(field);
    const fieldUuid = createdFieldsUuids.field;

    const createdField = await eisAPIService.getField(fieldUuid);

    const farmerObj = newFarmer.toObject();

    farmerObj.field = createdField;

    res.json(farmerObj);
});

export default router;
// module.exports = router;
