var express = require("express");
var router = express.Router();

const LotAreaService = require("./../services/lot-areas.service");
const lotAreas = new LotAreaService();

router.get("/", getAllLots);
router.get("/:id", getLot);
router.get("/inBbox/:bboxString", getAreaInBox);
router.put("/", updateLot);

async function getAllLots(req, res) {
    try {
        const response = await lotAreas.getAllLots();
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
}

async function getLot(req, res) {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const lot = await lotAreas.getLot(id);
        res.json(lot);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
}

async function updateLot(req, res) {
    const lot = req.body;
    if (!lot) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const newLot = await lotAreas.updateLot(lot);
        res.json(newLot);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
}

async function getAreaInBox(req, res) {
    const bboxStr = req.params["bboxString"];
    const elems = bboxStr.split(",");
    const bbox = {
        lowerLeft: {
            lat: elems[0],
            lng: elems[1],
        },
        upperRight: {
            lat: elems[2],
            lng: elems[3],
        },
    };

    try {
        const response = await lotAreas.getAreasInBbox(bbox);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
}

module.exports = router;
