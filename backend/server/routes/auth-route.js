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

    if (authService.login(name, password)) {
        req.session.loggedIn = true;
        req.session.name = name;
        res.json({name: name});
    } else {
        res.status(401);
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
    try {
        const response = authService.register(farmer.name, farmer.password, farmer.mobileNumber);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

module.exports = router;
