// import dependencies and initialize the express router
import { Router } from "express";
import { TwilioInstance } from "./../integrations/twilio/twilio.service";
import { MessageLogModel } from "../db/entities/messageLog";
import { MessageGroup, MessageGroupModel } from "../db/entities/messageGroup";
import { FarmerModel } from "../db/entities/farmer";

// We need to create and run a particular instance based on configuration.
// Or intelligently by looking at the number we're sending to.

const router = Router();

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
        const messageLog = await TwilioInstance.sendMessageToFarmer(farmer, message);
        res.json(messageLog)
    }
    catch (e: any) {
        res.status(500).send(e).end();
    }
});

/** 
 * This endpoint organises the messages into their groups and sends it
 * If a message doesn't have a group it's put into a farmer
 */
router.get("/threads", async (req, res) => {
    
});

export interface CreateConversationThreadDTO {
    farmer_ids: string[];
    message: string;
}

/**
 * This creates a thread with an inital message. Threads with no messages are orphans and shouldn't exist
 */
router.post('/threads', async (req, res) => {
    const body: CreateConversationThreadDTO = req.body;

    // Ensure farmer_ids exist
    const farmers = await FarmerModel.find({_id: {$in: body.farmer_ids}});
    if (farmers.length !== body.farmer_ids.length) {
        // Failed to find the farmers...
        return res.status(400).end("Farmer not Found!");
    }

    // Lets create the group
    const group = await MessageGroupModel.create({
        farmer_ids: body.farmer_ids
    });

    group.farmers = farmers;

    const messageLogs = await TwilioInstance.sendMessageToGroup(group, body.message);

    return res.json(messageLogs.map(it => it.messageRef));

});



export default router;
