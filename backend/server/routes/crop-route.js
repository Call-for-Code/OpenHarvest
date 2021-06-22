var express = require("express");
const CropService = require("../services/crop.service");
var router = express.Router();
const cropService = new CropService();

router.get("/", getAllCrops);

router.post("/", createOrUpdateCrop);

router.put("/", createOrUpdateCrop);

router.get("/:id", getCrop);

router.delete("/:id", deleteCrop);

async function getAllCrops(req, res) {
    const crops = await cropService.getAllCrops();
    res.json(crops);
}

async function createOrUpdateCrop(req, res) {
    const crop = req.body;
    if (!crop) {
        res.sendStatus(400).end();
        return;
    }

    try {
        const response = await cropService.saveOrUpdate(crop);
        res.json(response);
    } catch (e) {
        res.status(500).json(e);
    }
}

async function getCrop(req, res) {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }

    try {
        const crop = await cropService.getCrop(id);
        res.json(crop);
    } catch (e) {
        res.status(500).json(e);
    }
}

async function deleteCrop(req, res) {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }

    try {
        const crop = await cropService.deleteCrop(id);
        res.json(crop);
    } catch (e) {
        res.status(500).json(e);
    }
}

module.exports = router;
