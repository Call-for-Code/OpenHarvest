// import dependencies and initialize the express router
import { Router } from "express";
import { doesUserExist, getCoopManager, onBoardUser } from "./../services/coopManager.service";

const router = Router();

// define routes
router.get(":id", async (req, res) => {
    const id = req.params.id;
    const manager = await getCoopManager(id);
    if (manager !== null) {
        return res.json(manager.toObject());
    }
    else {
        return res.status(404).end();
    }
});

router.get("/hasBeenOnBoarded", async (req, res) => {
    const prefix = "IBMid:";
    if (req.user === undefined) {
        return res.status(400).send("User hasn't logged in.");
    }
    const id = `${prefix}${req.user.id}`;
    const result = await doesUserExist(id);
    res.json({exists: result});
});

router.post("/onboard", async (req, res) => {
    if (req.body === undefined) {
        return res.status(400).send("Body is missing");
    }
    if (req.body.oAuthSource === undefined) {
        return res.status(400).send("oAuthSource is missing");
    }
    if (req.body.oAuthId === undefined) {
        return res.status(400).send("oAuthId is missing");
    }
    if (req.body.user === undefined) {
        return res.status(400).send("user (Coop Manager) is missing");
    }
    if (req.body.orgId === undefined) {
        return res.status(400).send("OrgId is missing");
    }

    const userDoc = await onBoardUser(req.body.oAuthSource, req.body.oAuthId, req.body.user, req.body.orgId);
    res.json(userDoc.toObject());
});

export default router;
