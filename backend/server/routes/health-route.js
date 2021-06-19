// import dependencies and initialize the express router
const express = require("express");

const router = express.Router();

// define routes
router.get("", (req, res) => {
    console.log("In route - getHealth");
    res.json({
        status: "UP",
    });
});

module.exports = router;
