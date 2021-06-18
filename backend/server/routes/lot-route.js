var express = require('express');
var router = express.Router();

const LotAreaService = require("./../services/lot-areas.service");
const lotAreas = new LotAreaService();

router.get("/:id", async (req, res) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const lot = await lotAreas.getLot(id);
        res.json(lot);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.put("/", async (req, res) => {
    const lot = req.body;
    if (!lot) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const newLot = await lotAreas.updateLot(lot);
        res.json(newLot);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

module.exports = router;
