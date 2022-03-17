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

// // Link Lot
// router.post("/:id/lot", async(req: Request, res: Response) => {
//     const id = req.params["id"];
//     const lot = req.body; // Lot Details with crops

//     console.log(id, lot);

//     if (!id || !lot) {
//         res.sendStatus(400).end();
//         return;
//     }

//     try {
//         // Save the Lot information
//         let createdLotResult;
//         try {
//             createdLotResult = await lotAreas.updateLot(lot);
//         }
//         catch (e) {
//             // if (e.status != 409) {
//                 res.status(500).json(e);
//                 return;
//             // }
//         }
//         console.log(createdLotResult);

//         // const farmerResp = await client.getDocument({
//         //     db,
//         //     docId: `farmer:${id}`,
//         // });
//         // const farmer = farmerResp.result;
//         // console.log(farmer);
//         const farmer = await getFarmer(id);
//         console.log(farmer);
//         if (farmer == null) {
//             throw new Error("Farmer not found");
//         }

//         if (!farmer.land_ids.includes(lot._id)) {
//             farmer.land_ids.push(lot._id); // Convert to int
//             await farmer.save();
//         }
        
//         const filledFarmer = await getFarmer(id);
//         res.json(filledFarmer);
        
//     } catch (e) {
//         console.error(e);
//         res.status(500).json(e);
//     }

// });

// // Delete Lot link
// router.delete(":id/lot/:lot_id", async(req: Request, res: Response) => {
//     const id = req.params["id"];
//     const lot_id = req.params["lot_id"];

//     if (!id || !lot_id) {
//         res.sendStatus(400).end();
//         return;
//     }

//     try {
//         const farmer = await getFarmer(id);
//         console.log(farmer);
//         if (farmer == null) {
//             throw new Error("Farmer not found");
//         }

//         if (farmer.land_ids.includes(lot_id)) {
//             farmer.land_ids = farmer.land_ids.filter(it => it !== lot_id);
//         } else {
//             res.sendStatus(400).end();
//             return;
//         }

//         const updatedFarmer = await farmer.save()

//         res.json(updatedFarmer);
//     } catch (e) {
//         console.error(e);
//         res.status(500).json(e);
//     }

// });

export default router;
// module.exports = router;
