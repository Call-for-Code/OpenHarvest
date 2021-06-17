// initialize Cloudant
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const APPLICATION_DB = "application-db";
const db = APPLICATION_DB;

var express = require('express');
var router = express.Router();

router.get("/", async (req, res) => {
    const farmers = await client.postPartitionAllDocs({
        db,
        includeDocs: true,
        partitionKey: "farmer"
    });
    console.log(farmers);
    res.send(farmers.result);
});

async function createOrUpdateFarmer(req, res) {
    const farmer = req.body;
    const response = await client.postDocument({
        db,
        document: farmer
    })
    res.send(farmers.result);
}

router.post("/", createOrUpdateFarmer);

router.put("/", createOrUpdateFarmer);

router.get("/:id", async (req, res) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    const farmer = await client.getDocument({
        db,
        docId: `farmer:${id}`
    });
    res.send(farmer.result);
});



module.exports = router;
