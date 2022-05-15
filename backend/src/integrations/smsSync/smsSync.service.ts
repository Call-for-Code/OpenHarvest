import { FarmerModel } from "../../db/entities/farmer";
import { MessagingInterface } from "../messagingInterface";

import { v4 as uuidv4 } from "uuid";
import { MessageLog, MessageLogModel, Source, Status } from "../../db/entities/messageLog";
import { Farmer, User } from "common-types";

export interface SMSSyncMessage {
    to: string;
    message: string;
    uuid: string;
}

export interface SMSSyncMessageReceivedFormat {
    secret: string;
    /**
     * International number with a +
     */
    from: string;
    message: string;
    /**
     * Most annoyingly this is a string of a millisecond timestamp. We can just throw the parsed value into Date()
     */
    sent_timestamp: string;
    sent_to: string;
    message_id: string;
    device_id: string;
}

/**
 * This class handles interfacing with SMS Sync.
 */
export class SMSSyncAPI extends MessagingInterface<SMSSyncMessageReceivedFormat> {

    constructor() {
        super();
    }

    /**
     * SMS Sync is a little annoying in that the phone initiates the connection to get messages to send
     * So we have to have a list and provide a function to get the messages and clear it
     */
    private pendingMessages: SMSSyncMessage[] = [];

    async sendMessageToFarmer(farmer: Farmer, message: string): Promise<MessageLog> {
        if (message === undefined || message === null || message === "") {
            throw new Error("Message is empty!");
        }

        if (farmer.mobile.length === 0) {
            throw new Error("Farmer has no mobile numbers: " + farmer);
        }

        const number = farmer.mobile[0];

        const messageRef = await this.sendMessage(number, message);
        
        const messageLogEntry: MessageLog = {
            farmer_id: farmer._id!!.toString(),
            address: number,
            message,
            status: Status.Sent,
            source: Source.OpenHarvest,
            timestamp: new Date(),
            messageRef: messageRef
        }

        return await MessageLogModel.create(messageLogEntry);
    }

    async sendMessageToCoopManager(coopManager: User, message: string): Promise<MessageLog> {
        throw new Error("Method not implemented.");

        // const number = coopManager.mobile;
        // await this.sendMessage(number, message);

        // const messageLogEntry: MessageLog = {
        //     farmer_id: farmer._id!!.toString(),
        //     address: number,
        //     message,
        //     isViewed: true,
        //     source: Source.OpenHarvest,
        //     timestamp: new Date()
        // }

        // const messageLog = await MessageLogModel.create(messageLogEntry);

        // return messageLog;
        
    }
        
    async sendMessage(destination: string, message: string): Promise<string> {
        const messageRef = uuidv4();
        const smsMessage: SMSSyncMessage = {
            to: destination,
            message,
            uuid: messageRef
        }
        console.log("Adding Message to the list:", destination, message);
        this.pendingMessages.push(smsMessage);
        console.log(this.pendingMessages);
        return messageRef;
    }

    async onReceivedMessage(message: SMSSyncMessageReceivedFormat): Promise<MessageLog | null> {

        const farmer = await FarmerModel.findOne({mobile: message.from});

        if (farmer === null) {
            console.error("Unknown number!! Ignoring...");
            return null;
        }

        const parsedTimestamp = parseInt(message.sent_timestamp);

        const messageLogEntry: MessageLog = {
            farmer_id: farmer._id!!.toString(),
            address: message.from,
            message: message.message,
            status: Status.Unread,
            source: Source.Farmer,
            timestamp: new Date(parsedTimestamp),
            messageRef: message.message_id
        }

        const messageLog = await MessageLogModel.create(messageLogEntry);
        
        this.emit("onMessage", messageLog);
        await this.notify(messageLog)

        return messageLog;
    }

    /**
     * SMS Sync is a little annoying in that the phone initiates the connection to get messages to send
     * So we have to have a list and provide a function to get the messages and clear it
     */
    getMessagesToSend(): SMSSyncMessage[] {
        const messages = [...this.pendingMessages];
        this.pendingMessages = [];
        return messages;
    }
    
}

export const SMSSyncAPIInstance = new SMSSyncAPI();
