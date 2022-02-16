var express = require("express");
var cors = require("cors");
var router = express.Router();

const AuthService = require("./../services/auth.service");
const Auth = require("./../services/auth.service");
const authService = new AuthService();

// This will enable cors for all request. We should change it to use only our domain.
router.use(cors());

router.post("/login", async(req, res) => {

    const {name, password} = req.body;
    const user = await authService.login(name, password);

    if (user) {
        req.session.loggedIn = true;
        req.session.name = name;
        res.json({name: name, user});
    } else {
        res.status(401).send("Invalid name/password!");
    }
});

router.post("/logout", async(req, res) => {
    req.session.loggedIn = false;
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

module.exports = router;
