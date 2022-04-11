import { EventEmitter } from "eventemitter3";
import { io, Socket } from "socket.io-client";
import { AuthEventEmitter, CoopManagerUser } from "./auth";
import { Organisation } from "./organisation";

export class SocketIOClient extends EventEmitter {

    socket!: Socket;
    organisation!: Organisation;
    
    isInitialised = false;
    
    constructor() {
        super();
        console.log("[Socket IO] Created and waiting to be initialised. (Please login)");
    }

    initialise(organisation: Organisation) {
        this.organisation = organisation;
        this.socket = io(`/org-${organisation._id}`);
        this.socket.onAny((event, ...args) => {
            console.log("[Socket IO] Event:", event, ". Args:", ...args);
            this.emit(event, ...args);
        });

        console.log("[Socket IO] Client Started. Namespace:", `/org-${organisation._id}`);
    }

    reset() {
        if (!this.isInitialised) {
            return;
        }
        
        this.socket.disconnect();

        this.socket = undefined!!;
        this.organisation = undefined!!;
    }

    ensureInitialised() {
        if (!this.isInitialised) {
            throw new Error("SocketIOClient is not initialised with an Org!");
        }
    }
    
}

export const SocketIOClientInstance = new SocketIOClient();

AuthEventEmitter.on("signedIn", (user: CoopManagerUser) => {
    if (user.selectedOrganisation === undefined) {
        throw new Error("User Organisation not selected!");
    }
    SocketIOClientInstance.initialise(user.selectedOrganisation!!);
});

AuthEventEmitter.on("signedOut", () => {
    SocketIOClientInstance.reset();
});

