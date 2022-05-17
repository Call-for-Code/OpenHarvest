/**
 * This file is a pub-sub event bus for the application. It's in integrations because
 * eventually due to scale we'll have to move to an actual messaging service such as
 * RabbitMQ or Redis. Keeping all event bus interaction constrained to this one file
 * will make the move easy as it will just become an interface
 */

import { Organisation } from "../../../common-types/src";
import { EventEmitter } from "events";

import { MessageLog } from "../db/entities/messageLog";
import { SocketIOManagerInstance } from "../sockets/socket.io";

export declare interface EventBus {
    on(event: 'onMessage', listener: (message: MessageLog) => void): this;
}

/**
 * The EventBus is how the application can publish messages to itself and to other applications,
 * It's also used for communication to the 
 */
export class EventBus extends EventEmitter {

    constructor() {
        super();
    }

    publishMessage(org: Organisation, message: MessageLog) {
        this.emit("onMessage", message);
        SocketIOManagerInstance.publishMessage(org, message);
    }

}

export const EventBusInstance = new EventBus();



