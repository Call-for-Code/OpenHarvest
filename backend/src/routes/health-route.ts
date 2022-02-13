// import dependencies and initialize the express router
import { Router } from "express";

const router = Router();

// define routes
router.get("", (req, res) => {
    console.log("In route - getHealth");
    res.json({
        status: "UP",
    });
});

export default router;
