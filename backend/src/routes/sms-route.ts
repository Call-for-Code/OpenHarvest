/**
 * This route is used for incoming webhook sms messages from services like twilio and SMSSync 
 */


import { Router } from "express";
import { MessageLogModel } from "../db/entities/messageLog";
import { SMSSyncAPIInstance, SMSSyncMessageReceivedFormat } from "./../integrations/smsSync/smsSync.service";

const router = Router();

const SMSSyncSecret = "openHarvestSecret";

router.get("/sms-sync-incoming", async (req, res) => {
    // The phone app is asking us for messages

    if ("task" in req.query && req.query.task === "send") {
        const messages = SMSSyncAPIInstance.getMessagesToSend();
        console.log("SMS Sync Fetching Messages. Messages:", messages.length);
        return res.json({
            payload: {
                task: "send",
                secret: SMSSyncSecret,
                messages
            }
        });
    }
    return res.status(400).end();
});

router.post("/sms-sync-incoming", async (req, res) => {

    // console.log("Got Message", req.body.message);
    // return res.json({
    //     payload: {
    //         success: true,
    //         error: null
    //     }
    // });
    
    const message: SMSSyncMessageReceivedFormat = req.body;
    console.log("Messages:", message);

    // Check if the secret is correct or drop the connection
    if (message.secret !== SMSSyncSecret) {
        res.end();
    }

    SMSSyncAPIInstance.onReceivedMessage(message);
    
    return res.json({
        payload: {
            success: true,
            error: null
        }
    });
});


export default router;
