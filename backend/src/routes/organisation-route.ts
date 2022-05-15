// import dependencies and initialize the express router
import { isDefined, isUndefined, OrganisationDto } from "common-types";
import { Request, Router } from "express";
import { organisationService } from "../services/OrganisationService";

const router = Router();

router.get("/", async (req, res) => {
    const orgs = await organisationService.getAllOrganisations(true);
    // console.log(orgs);
    return res.json(orgs);
});

// define routes
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const org = await organisationService.getOrganisation(id);
    if (org == null) {
        return res.sendStatus(404);
    }
    else {
        return res.json(org);
    }
});

router.post("/", async (req: Request<{}, {}, OrganisationDto>, res) => {
    if (isUndefined(req.body)) {
        return res.status(400).send("Body is missing");
    }
    if (isUndefined(req.body.name)) {
        return res.status(400).send("name is missing");
    }
    const name = req.body.name;

    const organisation = await organisationService.getOrganisation(name)

    if (isDefined(organisation)) {
        return res.status(409).send("Organisation already exists: " + name);
    }
    console.log("Creating Org:", name);
    const doc = await organisationService.createOrganisation(req.body);
    res.json(doc);
});


export default router;
