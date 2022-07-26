import { CoopManager } from "../db/entities/coopManager";
import { Farmer } from "../db/entities/farmer";
import { MessageGroup } from "../db/entities/messageGroup";
import { MessageLog } from "../db/entities/messageLog";
import { AfricasTalkingInstance } from "./AfricasTalking/africasTalking.service";
import { MessagingInterface } from "./messagingInterface";
import { TwilioInstance } from "./twilio/twilio.service";

function getMessageInstanceByNumber(number: string): MessagingInterface<any> {
    if (number.startsWith("+61")) {
        console.log("Aus Phone number");
        return TwilioInstance;
    }
    else if (number.startsWith("+265")) {
        console.log("Malawi Phone number");
        return AfricasTalkingInstance;
    }
    else {
        throw new Error("Unknown Messaging Instance");
    }
}

/**
 * This class handles choosing the right service to send the message on.
 */
export class MessageInterfaceSender extends MessagingInterface<null> {
    sendMessageToFarmer(farmer: Farmer, message: string, group_id?: string | undefined): Promise<MessageLog> {
        const instance = getMessageInstanceByNumber(farmer.mobile);
        return instance.sendMessageToFarmer(farmer, message, group_id);
    }

    sendMessageToCoopManager(coopManager: CoopManager, message: string): Promise<MessageLog> {
        const instance = getMessageInstanceByNumber(coopManager.mobile);
        return instance.sendMessageToCoopManager(coopManager, message);
    }

    sendMessageToGroup(group: MessageGroup, message: string): Promise<MessageLog[]> {
        if (group.farmers === undefined) {
            throw new Error("Group is missing farmers!");
        }
        if (group._id === undefined) {
            throw new Error("Group is missing id!");
        }
        return Promise.all(group.farmers.map(it => this.sendMessageToFarmer(it, message, group._id!!.toString())));
    }

    sendMessage(destination: string, message: string): Promise<string> {
        throw new Error("Not Allowed to use this method");
    }

    onReceivedMessage(message: null): Promise<MessageLog | null> {
        throw new Error("Method not implemented.");
    }
    
}