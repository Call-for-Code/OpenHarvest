// import dependencies and initialize the express router
import { Router } from "express";
import { SMSSyncAPIInstance } from "./../integrations/smsSync/smsSync.service";
import { MessageLogModel } from "../db/entities/messageLog";
import { FarmerModel } from "../db/entities/farmer";

const router = Router();

const SMSSyncAPI = SMSSyncAPIInstance;

router.get("/", async (req, res) => {
    const messages = await MessageLogModel.find({}).lean();
    // console.log(orgs);
    return res.json(messages);
});

router.post("/sendSMSToFarmer", async (req, res) => {
    const farmerId = req.body.farmer_id;
    const message = req.body.message;

    const farmer = await FarmerModel.findById(farmerId);
    if (farmer == null) {
        return res.status(400).end("Farmer not Found!");
    }
    try {
        const messageLog = await SMSSyncAPI.sendMessageToFarmer(farmer, message);
        res.json(messageLog)
    }
    catch (e: any) {
        res.status(500).send(e).end();
    }
});


export default router;
