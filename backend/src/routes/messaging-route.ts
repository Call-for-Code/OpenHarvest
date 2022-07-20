// import dependencies and initialize the express router
import { Router } from "express";
import { TwilioInstance } from "./../integrations/twilio/twilio.service";
import { MessageLog, MessageLogModel } from "../db/entities/messageLog";
import { getFarmerIdsFromIndex, getIndexFromFarmerIds, MessageGroup, MessageGroupModel } from "../db/entities/messageGroup";
import { FarmerModel, Farmer } from "../db/entities/farmer";

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

export interface ThreadsDTO {
    /**
     * This is either the farmer_id or the group_id (depending on if this isn't a group thread or not)
     */
    thread_id: string;
    farmers: Farmer[];
    isGroup: boolean;
    preview: string;
    messages: MessageLog[];
}

/** 
 * This endpoint organises the messages into their groups and sends it
 * If a message doesn't have a group it's put into a farmer
 */
router.get("/threads", async (req, res) => {
    const messages = await MessageLogModel.find({}).lean().exec();
    const groups = await MessageGroupModel.find({}).lean().exec();
    // Group_id to index
    const groupLookup: {[key: string]: string} = {};

    const threadMap: {[index: string]: ThreadsDTO} = {};

    for (const group of groups) {
        const index = getIndexFromFarmerIds(group.farmer_ids);
        if (!(index in groupLookup)) {
            groupLookup[group._id.toString()] = index;
        } 
    }  

    // Iterate through the messages
    for (const message of messages) {
        // Get the index first
        let index = "INVALID";
        if (message.group_id === null && message.farmer_id !== null) {
            // This is a DM
            // The farmer is the index
            index = message.farmer_id;
            if (!(index in threadMap)) {
                const thread: ThreadsDTO = {
                    thread_id: index,
                    farmers: [],
                    isGroup: false,
                    preview: "",
                    messages: []
                }
                threadMap[index] = thread;
            }
        }
        else if (message.group_id !== null) {
            // This is a group message
            // The combined
            index = groupLookup[message.group_id];
            if (!(index in threadMap)) {
                const thread: ThreadsDTO = {
                    thread_id: index,
                    farmers: [],
                    isGroup: true,
                    preview: "",
                    messages: []
                }
                threadMap[index] = thread;
            }
        }
        else {
            console.error(`[Message Route] Unable to determine if message is a DM or group message: ${message._id}`);
            continue;
        }

        threadMap[index].messages.push(message);
    }

    // Get the farmers and add it to the thread
    const threads: ThreadsDTO[] = Array.from(Object.values(threadMap));
    const farmer_ids = threads.map(it => it.isGroup ? getFarmerIdsFromIndex(it.thread_id) : it.thread_id).flat();    
    // console.log(threads, farmer_ids, getFarmerIdsFromIndex(threads[0].thread_id));
    const farmers = await FarmerModel.find({_id: {$in: farmer_ids}});
    const farmerLookup: {[key: string]: Farmer} = {};
    for (const farmer of farmers) {
        farmerLookup[farmer._id.toString()] = farmer;
    }

    for (let i = 0; i < threads.length; i++) {
        const thread = threads[i];
        if (thread.isGroup) {
            const ids = getFarmerIdsFromIndex(thread.thread_id);
            thread.farmers = ids.map(it => farmerLookup[it]);
        }
        else {
            thread.farmers = [farmerLookup[thread.thread_id]];
        }

        thread.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        thread.preview = thread.messages[thread.messages.length - 1].message;
    }
    
    res.json(threads);
});

export interface CreateConversationThreadDTO {
    farmer_ids: string[];
    message: string;
}

/**
 * This creates a thread with an inital message. Threads with no messages are orphans and shouldn't exist
 */
router.post('/new-thread', async (req, res) => {
    const body: CreateConversationThreadDTO = req.body;

    // Ensure farmer_ids exist
    const farmers = await FarmerModel.find({_id: {$in: body.farmer_ids}});
    if (farmers.length !== body.farmer_ids.length) {
        // Failed to find the farmers...
        return res.status(400).end("Farmer not Found!");
    }

    // Find an existing group or create one
    const index = getIndexFromFarmerIds(body.farmer_ids);
    let group = await MessageGroupModel.findOne({farmer_id_index: index});
    if (group === null) {
        // Lets create the group
        group = await MessageGroupModel.create({
            farmer_ids: body.farmer_ids
        });
    }

    group.farmers = farmers;

    try {
        const messageLogs = await TwilioInstance.sendMessageToGroup(group, body.message);
        
        const thread: ThreadsDTO = {
            thread_id: index,
            farmers,
            isGroup: true,
            preview: body.message,
            messages: messageLogs
        }

        // return res.json(messageLogs.map(it => it.messageRef));
        return res.json(thread);
    }
    catch (e: any) {
        res.status(500).send(e).end();
    }

});

export interface SendMessageToThreadDTO {
    thread_id: string;
    message: string;
};

router.post('/thread', async (req, res) => {
    const body: SendMessageToThreadDTO = req.body;
    if (!body.thread_id) {
        return res.status(400).end("Missing thread_id");
    }
    if (!body.message) {
        return res.status(400).end("Missing message");
    }
    const {thread_id, message} = body;

    const isGroup = thread_id.includes("|");

    if (isGroup) {
        const group = await MessageGroupModel.findOne({farmer_id_index: thread_id});
        if (group === null) {
            return res.status(400).end("Unknown thread_id");
        }
        const farmers = await FarmerModel.find({_id: {$in: group.farmer_ids}});
        group.farmers = farmers;

        try {
            const messageLogs = await TwilioInstance.sendMessageToGroup(group, body.message);
            return res.json(messageLogs.map(it => it.messageRef));
        }
        catch (e: any) {
            res.status(500).send(e).end();
        }
    }
    else {
        const farmer = await FarmerModel.findById(thread_id);
        if (farmer === null) {
            return res.status(400).end("Unknown thread_id");
        }

        try {
            const messageLog = await TwilioInstance.sendMessageToFarmer(farmer, message);
            res.json(messageLog)
        }
        catch (e: any) {
            res.status(500).send(e).end();
        }
    }


});



export default router;
