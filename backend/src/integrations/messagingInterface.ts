import { Farmer } from "./../db/entities/farmer";
import { EventEmitter } from "events";
import { MessageLog } from "./../db/entities/messageLog";
import { CoopManager } from "./../db/entities/coopManager";

export declare interface MessagingInterface<ReceivedMessageType> {
    on(event: 'onMessage', listener: (message: MessageLog) => void): this;
}

export abstract class MessagingInterface<ReceivedMessageType> extends EventEmitter {

    constructor() {
        super();
    }

    /**
     * This method handles sending a message to a farmer.
     * The details that the message service needs should be saved in the farmer
     * For example with SMS there is a mobile number field
     * @param farmer Farmer we're sending a message to.
     * @param message The string message we want to send.
     */
    abstract sendMessageToFarmer(farmer: Farmer, message: string): Promise<MessageLog>;

    /**
     * This method handles sending a message to a Coop Manager.
     * The details that the message service needs should be saved in the details of the coopManger
     * @param coopManager CoopManager we're sending a message to.
     * @param message The string message we want to send.
     */
    abstract sendMessageToCoopManager(coopManager: CoopManager, message: string): Promise<MessageLog>;

    /**
     * Send a message to an arbitrary destination. This is a way of giving flexibility
     * to send a message to anywhere.
     * @param destination The destination represented as a string
     * @param message The message to send
     * @returns The message ref id
     */
    abstract sendMessage(destination: string, message: string): Promise<string>;

    /**
     * This method lets the Messaging Service know that a new external message
     * has been sent to it. It handles parsing the message, adding it to the
     * message log and echoing that message out to listening parties.
     * 
     * Make sure to call `MessagingInterface.notify(MessageLog)` after processing
     * the message to let the application and other know about this message. 
     * 
     * Make sure to trigger the eventEmitter `onMessage(MessageLog)` event for
     * any code listening to this particular channel.
     * @param message The message that the external service has sent us back
     */
    abstract onReceivedMessage(message: ReceivedMessageType): Promise<MessageLog | null>;

    /**
     * Send a message out on the event bus notifying that we've received a message.
     * All 
     * @param message The message we've received. (That's also already in the database)
     */
    notify(message: MessageLog) {
        
    }

}