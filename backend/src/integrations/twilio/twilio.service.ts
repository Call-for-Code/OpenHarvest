import { Farmer, User } from "common-types";
import twilio, { Twilio } from "twilio";
import { FarmerModel } from "../../db/entities/farmer";
import { MessageLog, MessageLogModel, Source, Status } from "../../db/entities/messageLog";
import { MessagingInterface } from "../messagingInterface";

/**
 * The Message we get from Twilio on our webhook
 * Source: https://www.twilio.com/docs/messaging/guides/webhook-request
 */
export interface TwilioMessage {
    MessageSid: string;
    SmsSid: string;
    AccountSid: string;
    MessagingServiceSid: string;
    From: string;
    To: string;
    Body: string;
    NumMedia: number;
    // todo media items
}


/**
 * This class handles interfacing with twilio.
 * It provides one 
 */
export class TwilioAPI extends MessagingInterface<TwilioMessage> {

    client: Twilio;
    messagingServiceSid: string;
    twilioInstance: TwilioAPI;
    constructor() {
        super();
        const accountSid = process.env.Twilio_accountSid;
        const authToken = process.env.Twilio_token;
        this.messagingServiceSid = process.env.Twilio_messaging_service as string;
        this.client = twilio(accountSid, authToken);
        this.twilioInstance = new TwilioAPI();
    }

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
            messageRef
        }

        return await MessageLogModel.create(messageLogEntry);
    }

    async sendMessageToCoopManager(coopManager: User, message: string): Promise<MessageLog> {
        throw new Error("Method not implemented.");
    }


    /**
     * Send a message to a number
     * @param number The number we're sending to
     * @param message The string message to send
     */
    async sendMessage(number: string, message: string): Promise<string> {
        const twilioMessage = await this.client.messages.create({
            messagingServiceSid: this.messagingServiceSid,
            to: number,
            body: message,
        });
        
        return twilioMessage.sid
    }


    async onReceivedMessage(message: TwilioMessage): Promise<MessageLog | null> {
        const number = message.From;

        const farmer = await FarmerModel.findOne({mobile: number});

        if (farmer === null) {
            console.error("Unknown number!! Ignoring...", number);
            return null;
        }

        const messageLogEntry: MessageLog = {
            farmer_id: farmer._id!!.toString(),
            address: message.From,
            message: message.Body,
            status: Status.Unread,
            source: Source.Farmer,
            timestamp: new Date(),
            messageRef: message.MessageSid
        }

        const messageLog = await MessageLogModel.create(messageLogEntry);
        
        this.emit("onMessage", messageLog);
        this.notify(messageLog)

        return messageLog;
    }
    
}


