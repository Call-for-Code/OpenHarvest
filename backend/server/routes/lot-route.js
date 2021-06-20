var express = require("express");
var router = express.Router();

const LotAreaService = require("./../services/lot-areas.service");
const lotAreas = new LotAreaService();

router.get("/:id", async(req, res) => {
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
});

router.put("/", async(req, res) => {
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
});

router.get("/inBbox/:bboxString", async(req, res) => {
    const bboxStr = req.params["bboxString"];
    console.log(bboxStr);
    const elems = bboxStr.split(",");
    const bbox = {
        lowerLeft: {
            lat: elems[0],
            lng: elems[1]
        },
        upperRight: {
            lat: elems[2],
            lng: elems[3]
        },
    }
    try {
        const response = await lotAreas.getAreasInBbox(bbox);
        // console.log(response);
        res.json(response);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

});

module.exports = router;
