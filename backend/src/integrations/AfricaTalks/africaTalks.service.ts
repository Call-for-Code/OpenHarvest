import { CoopManager } from "./../../db/entities/coopManager";
import Africastalking from "africastalking";
import { Farmer, FarmerModel } from "./../../db/entities/farmer";
import { MessageLog, MessageLogModel, Source, Status } from "./../../db/entities/messageLog";
import { MessagingInterface } from "./../../integrations/messagingInterface";



/**
 * The Message we get from africastalks on our webhook
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

    SMSClient: any;
    SMSShortCode: string;

    constructor() {
        super();
        const apiKey = process.env.Africastalking_apiKey;
        const username = process.env.Africastalking_username;
        this.SMSShortCode = process.env.Africastalking_SMS_ShortCode!!;

        if (apiKey === undefined) {
            throw new Error("AfricasTalking API Key not defined! Enter the data in the env var: Africastalking_apiKey");
        }
        if (username === undefined) {
            throw new Error("AfricasTalking username not defined! Enter the data in the env var: Africastalking_username");
        }
        if (this.SMSShortCode === undefined) {
            throw new Error("AfricasTalking SMS short code not defined! Enter the data in the env var: Africastalking_SMS_ShortCode");
        }

        const africastalking = Africastalking({
            apiKey, 
            username
        });

        this.SMSClient = africastalking.SMS;
    }

    async sendMessageToFarmer(farmer: Farmer, message: string, group_id?: string): Promise<MessageLog> {
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
            group_id: group_id ?? null,
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
        const response = await this.SMSClient.send({
            to: number,
            message,
            from: this.SMSShortCode
        });

        console.log("[AfricasTalking] Response", response);
        
        return "Unavailable";
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
            group_id: null,
            messageRef: message.Sessionid+message.text
        }

        const messageLog = await MessageLogModel.create(messageLogEntry);
        
        this.emit("onMessage", messageLog);
        this.notify(messageLog)

        return messageLog;
    }
    
    async onReceivedUSSDMessage(message: ATMessage): Promise<string> {
        const number = message.phoneNumber;

        const farmer = await FarmerModel.findOne({mobile: number});

        // if (farmer === null) {
        //     console.error("Unknown number!! Ignoring...", number);
        //     return null;
        // }

        const id = farmer ? farmer.id!!.toString() : "";

        const messageLogEntry: MessageLog = {
            farmer_id: id,
            address: message.phoneNumber,
            message: message.text,
            status: Status.Unread,
            source: Source.Farmer,
            timestamp: new Date(),
            group_id: null,
            messageRef: message.Sessionid+message.text
        }

        const messageLog = await MessageLogModel.create(messageLogEntry);
        
        this.emit("onMessage", messageLog);
        this.notify(messageLog);

        const response = this.handleUSSDMessage(message);

        const messageLogResponse: MessageLog = {
            farmer_id: id,
            address: message.phoneNumber,
            message: message.text,
            status: Status.Unread,
            source: Source.OpenHarvest,
            timestamp: new Date(),
            group_id: null,
            messageRef: "OH"+message.Sessionid+message.text
        }

        const messageLogDoc = await MessageLogModel.create(messageLogEntry);
        const messageLogResponseDoc = await MessageLogModel.create(messageLogResponse);
                
        this.emit("onMessage", messageLogDoc);
        this.notify(messageLogDoc);

        this.emit("onMessage", messageLogResponseDoc);
        this.notify(messageLogResponseDoc);

        return response;
    }

    

    async handleUSSDMessage(message: ATMessage): Promise<string> {
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
