// import dependencies and initialize the express router
import { Router } from "express";
import { getOrganisations } from "./../services/organisation.service";
import { addCoopManagerToOrganisation, doesUserExist, getCoopManager, onBoardUser } from "./../services/coopManager.service";
import { generateJWTFromOpenIDUser } from "./../auth/helpers";
import { opts } from "./../auth/jwtStrategy";

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

    const userDoc = await onBoardUser(req.body.oAuthSource, req.body.oAuthId, req.body.user);

    // Set the Organisation variables on the user
    req.user.isOnboarded = true;
    req.user.coopManager = userDoc.toObject();
    req.user.organisations = await getOrganisations(userDoc.coopOrganisations);
    req.user.selectedOrganisation = req.user.organisations[0];

    const token = generateJWTFromOpenIDUser(req.user, opts.secretOrKey);

    res.json({
        token,
        user: userDoc.toObject()
    });
});

router.put("/setCurrentOrganisation", async (req, res) => {
    if (req.body === undefined) {
        return res.status(400).send("Body is missing");
    }
    if (req.body.orgId === undefined) {
        return res.status(400).send("orgId is missing");
    }
    const orgId = req.body.orgId;
    const org = req.user.organisations.find(it => it._id == orgId);
    if (org == undefined) {
        return res.status(400).json("User is not part of organisation");
    }

    req.user.selectedOrganisation = org;

    res.json(org);    
})

router.put("/:id/addOrganisation", async (req, res) => {
    if (req.body === undefined) {
        return res.status(400).send("Body is missing");
    }
    if (req.body.orgId === undefined) {
        return res.status(400).send("coopManagerId is missing");
    }
    const orgId = req.body.orgId;
    const coopManagerId = req.params.id;
    const coopUser = await addCoopManagerToOrganisation(coopManagerId, orgId);

    req.user.coopManager = coopUser.toObject();
    req.user.organisations = await getOrganisations(coopUser.coopOrganisations, true);

    res.json(coopUser.toObject());
});

export default router;
