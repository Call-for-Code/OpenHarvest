import { text } from "express";
import twilio, { Twilio} from "twilio";
import { CoopManager } from "./../../db/entities/coopManager";
import { Farmer, FarmerModel } from "./../../db/entities/farmer";
import { MessageLog, MessageLogModel, Source, Status } from "./../../db/entities/messageLog";
import { MessagingInterface } from "./../../integrations/messagingInterface";

/**
 * The Message we get from Twilio on our webhook
 * Source: https://www.twilio.com/docs/messaging/guides/webhook-request
 */
export interface ATMessage {
    Sessionid: string;
    servicecode: string;
    phoneNumber: string;
    text: string;


    // todo media items
}


/**
 * This class handles interfacing with twilio.
 * It provides one 
 */
class AfricaTalksAPI extends MessagingInterface<ATMessage> {


    constructor() {
        super();
        const accountSid = process.env.Twilio_accountSid;
        const authToken = process.env.Twilio_token;

    }

    async sendMessageToFarmer(farmer: Farmer, message: string): Promise<MessageLog> {
        // const number = farmer.mobile;

        // if (message === undefined || message === null || message === "") {
        //     throw new Error("Message is empty!");
        // }

        // const messageRef = await this.sendMessage(number, message);
        
        // const messageLogEntry: MessageLog = {
        //     farmer_id: farmer._id!!.toString(),
        //     address: number,
        //     message,
        //     status: Status.Sent,
        //     source: Source.OpenHarvest,
        //     timestamp: new Date(),
        //     messageRef
        // }

        // const messageLog = await MessageLogModel.create(messageLogEntry);

        // return messageLog;
        throw new Error("Method not implemented.");
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
        // const twilioMessage = await this.client.messages.create({
        //     messagingServiceSid: this.messagingServiceSid,
        //     to: number,
        //     body: message,
        // });
        
        // return twilioMessage.sid
        throw new Error("Method not implemented.");
    }


    async onReceivedMessage(message: ATMessage): Promise<MessageLog | null> {
        const number = message.phoneNumber;

        const farmer = await FarmerModel.findOne({mobile: number});

        if (farmer === null) {
            console.error("Unknown number!! Ignoring...", number);
            return null;
        }

        const messageLogEntry: MessageLog = {
            farmer_id: farmer._id!!.toString(),
            address: message.phoneNumber,
            message: message.text,
            status: Status.Unread,
            source: Source.Farmer,
            timestamp: new Date(),
            messageRef: message.Sessionid+message.text
        }

        const messageLog = await MessageLogModel.create(messageLogEntry);
        
        this.emit("onMessage", messageLog);
        this.notify(messageLog)

        return messageLog;
        
    }

    async responddMessage(message: ATMessage): Promise<string> {
        if (message.text === ""){
            return "CON Thank you for contacting OpenHarvest! Here are the menu items: \n 1.Reputation Value \n2.Weather Updates \n3.Send Task status"
            
        }
        else if (message.text === "1"){
            return "END You are loved"
        }
        else if (message.text === "2"){
            return "Weather Forecast for $date : \nCloudy \nPrecipitation: "
        }
        else if (message.text === "3"){
            return "CON Please enter your task id:"
        }
        else if (message.text.match(/3\*(\d+)/i)){
            return "CON Please enter your task status ( 1 = in-progress , 2 = completed ):"
        }
        else if (message.text.match(/3\*(\d+)\*(1|2)/i)){
            return "END Thank you, your task status has been received."
        }
        

        return ""
    }
    
}

export const AfricaTalksInstance = new AfricaTalksAPI();
