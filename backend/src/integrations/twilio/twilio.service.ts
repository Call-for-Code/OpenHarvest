import twilio, { Twilio} from "twilio";
import { CoopManager } from "./../../db/entities/coopManager";
import { Farmer, FarmerModel } from "./../../db/entities/farmer";
import { MessageLog, MessageLogModel, Source, Status } from "./../../db/entities/messageLog";
import { MessagingInterface } from "./../../integrations/messagingInterface";

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
class TwilioAPI extends MessagingInterface<TwilioMessage> {

    client: Twilio;
    messagingServiceSid: string;
    constructor() {
        super();
        const accountSid = process.env.Twilio_accountSid;
        const authToken = process.env.Twilio_token;
        this.messagingServiceSid = process.env.Twilio_messaging_service as string;
        this.client = twilio(accountSid, authToken);
    }

    async sendMessageToFarmer(farmer: Farmer, message: string): Promise<MessageLog> {
        const number = farmer.mobile;

        if (message === undefined || message === null || message === "") {
            throw new Error("Message is empty!");
        }

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

        const messageLog = await MessageLogModel.create(messageLogEntry);

        return messageLog;
    }

    async sendMessageToCoopManager(coopManager: CoopManager, message: string): Promise<MessageLog> {
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

export const TwilioInstance = new TwilioAPI();
