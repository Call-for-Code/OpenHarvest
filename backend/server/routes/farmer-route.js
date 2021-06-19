// initialize Cloudant
const client = require("./../db/cloudant");
// const { CloudantV1 } = require("@ibm-cloud/cloudant");
// const client = CloudantV1.newInstance({});


const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

var express = require('express');
var router = express.Router();

/**
 * 
 */
const LotAreaService = require("./../services/lot-areas.service");
const lotAreas = new LotAreaService();

router.get("/", async (req, res) => {
    try {
        const farmers = await client.postPartitionAllDocs({
            db,
            includeDocs: true,
            partitionKey: "farmer"
        });
        res.json(farmers.result.rows.map(it => it.doc));
    } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
});

async function createOrUpdateFarmer(req, res) {
    const farmer = req.body;
    if (!farmer) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const response = await client.postDocument({
            db,
            document: farmer
        })
        res.json(response.result);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
    
}

router.post("/", createOrUpdateFarmer);

router.put("/", createOrUpdateFarmer);

router.get("/:id", async (req, res) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const response = await client.getDocument({
            db,
            docId: `farmer:${id}`
        });
        const farmer = response.result;
        farmer.lots = await lotAreas.getLots(farmer.lot_ids);
        res.json(farmer);
    }
    catch (e) {
        if (e.status == 404) {
            res.status(404).json(e);
            return;
        }
        else {
            console.error(e);
            res.status(500).json(e);
        }
    }
});

// Delete Farmer
router.delete("/:id", async (req, res) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const response = await client.deleteDocument({
            db,
            docId: id
        });
        res.json(response.result)
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    } 
    
});

// Link Lot
router.post(":id/lot", async (req, res) => {
    const id = req.params["id"];
    const lot = req.body; // Lot Details with crops
    
    if (!id || !lot) {
        res.sendStatus(400).end();
        return;
    }

    try {
        // Save the Lot information
        const createdLotResult = await lotAreas.updateLot(lot);
        console.log(createdLotResult);

        const farmer = await client.getDocument({
            db,
            docId: `farmer:${id}`
        });

        farmer.lot_ids.append(lot._id); //Convert to int

        const newFarmer = await client.putDocument({
            db,
            docId: farmer._id,
            document: farmer
        });

        res.json(newFarmer.result); 
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

});

// Delete Lot link
router.delete(":id/lot/:lot_id", async (req, res) => {
    const id = req.params["id"];
    const lot_id = req.params["lot_id"];

    if (!id || !lot_id) {
        res.sendStatus(400).end();
        return;
    }

    try {
        const farmer = await client.getDocument({
            db,
            docId: `farmer:${id}`
        });

        if (farmer.lot_ids.includes(lot_id)) {
            farmer.lot_ids = farmer.lot_ids.filter(it => it != lot_id);
        }
        else {
            res.sendStatus(400).end();
            return;
        }

        const newFarmer = await client.putDocument({
            db,
            docId: farmer._id,
            document: farmer
        });

        res.json(newFarmer.result);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
    
});

module.exports = router;
