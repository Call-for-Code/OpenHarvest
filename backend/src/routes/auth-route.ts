import { Router } from "express";
import cors from "cors";
var router = Router();

import { AuthService } from "./../services/auth.service";
const authService = new AuthService();

// This will enable cors for all request. We should change it to use only our domain.
router.use(cors());

router.post("/login", async(req, res) => {

    const {name, password} = req.body;
    const user = await authService.login(name, password);

    if (user) {
        // @ts-ignore
        req.session.loggedIn = true;
        // @ts-ignore
        req.session.name = name;
        res.json({name: name, user});
    } else {
        res.status(401).send("Invalid name/password!");
    }
});

router.post("/logout", async(req, res) => {
    // @ts-ignore
    req.session.loggedIn = false;
    // @ts-ignore
    req.session.name = undefined;

    res.json({session: req.session});
});

router.post("/register", async(req, res) => {
    const farmer = req.body;

    if (!farmer) {
        res.sendStatus(400).end();
        return;
    }

    const userExists = await authService.isUserExists(farmer.name);
    if (userExists) {
        res.status(400).send("User already exists!").end();
        return;
    }

    try {
        const response = authService.register(farmer.name, farmer.password, farmer.mobileNumber);
        res.json(response);
    } catch (e) {
        res.status(500).json(e);
    }
});

export default router;
