// import dependencies and initialize the express router
import { Router } from "express";
import { addCoopManagerToOrganisation, createOrganisationFromName, getAllOrganisations, getOrganisation } from "./../services/organisation.service";

const router = Router();

router.get("/", async (req, res) => {
    const orgs = await getAllOrganisations(true);
    // console.log(orgs);
    return res.json(orgs);
});

// define routes
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const org = await getOrganisation(id);
    if (org == null) {
        return res.sendStatus(404);
    }
    else {
        return res.json(org.toObject());
    }
});

router.post("/", async (req, res) => {
    if (req.body === undefined) {
        return res.status(400).send("Body is missing");
    }
    if (req.body.name === undefined) {
        return res.status(400).send("name is missing");
    }
    const name = req.body.name;
    console.log("Creating Org:", name);
    const doc = await createOrganisationFromName(name);
    res.json(doc.toObject());
});

router.put("/:orgId/addCoopManager", async (req, res) => {
    if (req.body === undefined) {
        return res.status(400).send("Body is missing");
    }
    if (req.body.coopManagerId === undefined) {
        return res.status(400).send("coopManagerId is missing");
    }
    const orgId = req.params.orgId;
    const coopManagerId = req.body.coopManagerId;
    const org = await addCoopManagerToOrganisation(coopManagerId, orgId);
    res.json(org.toObject());
});

export default router;
