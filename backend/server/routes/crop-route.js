// initialize Cloudant
// const client = require("./../db/cloudant");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});


const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

var express = require('express');
var router = express.Router();

const LotAreaService = require("./../services/lot-areas.service");
const lotAreas = new LotAreaService();

router.get("/", async (req, res) => {
    const farmers = await client.postPartitionAllDocs({
        db,
        includeDocs: true,
        partitionKey: "crop"
    });
    console.log(farmers);
    res.json(farmers.result);
});

async function createOrUpdateCrop(req, res) {
    const crop = req.body;
    if (!crop) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const response = await client.postDocument({
            db,
            document: crop
        })
        res.json(response.result);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
}

router.post("/", createOrUpdateCrop);

router.put("/", createOrUpdateCrop);

router.get("/:id", async (req, res) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const crop = await client.getDocument({
            db,
            docId: `crop:${id}`
        });
        res.json(crop.result);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

// Delete Crop
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

module.exports = router;
