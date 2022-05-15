import { Request, Response, Router } from "express";
import LandAreasService from "../services/land-areas.service";

var router = Router();

const lotAreas = new LandAreasService();

router.get("/", getAllLots);
router.get("/:id", getLot);
router.get("/inBbox/:bboxString", getAreaInBox);
router.put("/", updateLot);

async function getAllLots(req: Request, res: Response) {
    try {
        const response = await lotAreas.getAllLots();
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
}

async function getLot(req: Request, res: Response) {
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

async function updateLot(req: Request, res: Response) {
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

async function getAreaInBox(req: Request, res: Response) {
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

export default router;
