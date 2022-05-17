import { Request, Response, Router } from "express";
import { farmerService } from "../services/FarmerService";

import { FarmerModel } from "../db/entities/farmer";
import { farmService } from "../services/FarmService";
import { Farmer, isUndefined, NewFarmer } from "../../../common-types/src";

// const LotAreaService = require("./../services/lot-areas.service");
// const lotAreas = new LandAreasService();

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        res.json(farmerService.getFarmers());
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
        res.json(farmerService.saveFarmer(farmer));
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

}

async function getFarmer(id: string): Promise<Farmer | null> {
    return farmerService.getFarmer(id);
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
        const farmer = await getFarmer(id);
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
        const result = await FarmerModel.findByIdAndDelete(id);
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});



router.post("/add", async(req: Request<{}, {}, NewFarmer>, res: Response) => {
    const newFarmer: NewFarmer = req.body;
    if (isUndefined(newFarmer)) {
        res.status(400).send("Farmer is not defined");
        return;
    }
    if (isUndefined(newFarmer.farms)) {
        res.status(400).send("Farm is not defined");
        return;
    }
    const farmer = await farmerService.saveFarmer(newFarmer);

    await farmService.saveFarms(farmer, newFarmer.farms);

    res.json(farmer);
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
