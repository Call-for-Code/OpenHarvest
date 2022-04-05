/**
 * This file is a pub-sub event bus for the application. It's in integrations because
 * eventually due to scale we'll have to move to an actual messaging service such as
 * RabbitMQ or Redis. Keeping all event bus interaction constrained to this one file
 * will make the move easy as it will just become an interface
 */

import { EventEmitter } from "events";

import { MessageLog } from "./../db/entities/messageLog";

export declare interface EventBus {
    on(event: 'onMessage', listener: (message: MessageLog) => void): this;
}

export class EventBus extends EventEmitter {

    constructor() {
        super();
    }

    publishMessage(message: MessageLog) {
        this.emit("onMessage", message);
    }

}

export const EventBusInstance = new EventBus();



