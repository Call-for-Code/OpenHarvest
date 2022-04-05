import { CoopManager } from "db/entities/coopManager";
import { Farmer } from "db/entities/farmer";
import { MessagingInterface } from "integrations/messagingInterface";

/**
 * This class handles interfacing with twilio.
 * It provides one 
 */
class TwilioAPI extends MessagingInterface<string> {

    constructor() {
        super();
    }

    sendMessageToFarmer(farmer: Farmer, message: string): void {
        throw new Error("Method not implemented.");
    }
    sendMessageToCoopManager(coopManager: CoopManager, message: string): void {
        throw new Error("Method not implemented.");
    }
    sendMessage(destination: string, message: string): void {
        throw new Error("Method not implemented.");
    }
    onReceivedMessage(message: string): void {
        throw new Error("Method not implemented.");
        // this.on("onMessage")
    }
    
}