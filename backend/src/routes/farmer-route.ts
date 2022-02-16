import { Router, Request, Response } from "express";

import { FarmerModel } from "../db/entities/farmer";


import LandAreasService from "../services/land-areas.service";

// const LotAreaService = require("./../services/lot-areas.service");
const lotAreas = new LandAreasService();

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const docs = await FarmerModel.find({}).lean().exec();
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
    // const response = await client.getDocument({
    //     db,
    //     docId: `farmer:${id}`,
    // });
    // const farmer = response.result;
    // farmer.lots = await lotAreas.getLots(farmer.lot_ids);

    // Aggregate with land areas eventually
    const farmer = await FarmerModel.findById(id).exec();
    if (farmer == null) {
        return null;
    }
    farmer.lands = await lotAreas.getLots(farmer.land_ids);
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

// Link Lot
router.post("/:id/lot", async(req: Request, res: Response) => {
    const id = req.params["id"];
    const lot = req.body; // Lot Details with crops

    console.log(id, lot);

    if (!id || !lot) {
        res.sendStatus(400).end();
        return;
    }

    try {
        // Save the Lot information
        let createdLotResult;
        try {
            createdLotResult = await lotAreas.updateLot(lot);
        }
        catch (e) {
            // if (e.status != 409) {
                res.status(500).json(e);
                return;
            // }
        }
        console.log(createdLotResult);

        // const farmerResp = await client.getDocument({
        //     db,
        //     docId: `farmer:${id}`,
        // });
        // const farmer = farmerResp.result;
        // console.log(farmer);
        const farmer = await getFarmer(id);
        console.log(farmer);
        if (farmer == null) {
            throw new Error("Farmer not found");
        }

        if (!farmer.land_ids.includes(lot._id)) {
            farmer.land_ids.push(lot._id); // Convert to int
            await farmer.save();
        }
        
        const filledFarmer = await getFarmer(id);
        res.json(filledFarmer);
        
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

});

// Delete Lot link
router.delete(":id/lot/:lot_id", async(req: Request, res: Response) => {
    const id = req.params["id"];
    const lot_id = req.params["lot_id"];

    if (!id || !lot_id) {
        res.sendStatus(400).end();
        return;
    }

    try {
        const farmer = await getFarmer(id);
        console.log(farmer);
        if (farmer == null) {
            throw new Error("Farmer not found");
        }

        if (farmer.land_ids.includes(lot_id)) {
            farmer.land_ids = farmer.land_ids.filter(it => it !== lot_id);
        } else {
            res.sendStatus(400).end();
            return;
        }

        const updatedFarmer = await farmer.save()

        res.json(updatedFarmer);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

});

export default router;
// module.exports = router;
