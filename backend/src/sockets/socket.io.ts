import { MessageLog } from "./../db/entities/messageLog";
import { Server as NodejsServer } from "http";
import { Namespace, Server } from "socket.io";
import { Organisation } from "./../db/entities/organisation";


// interface ServerToClientEvents {
//     noArg: () => void;
//     basicEmit: (a: number, b: string, c: Buffer) => void;
//     withAck: (d: string, callback: (e: number) => void) => void;
// }

// interface ClientToServerEvents {
//     hello: () => void;
// }

// interface InterServerEvents {
//     ping: () => void;
// }

// interface SocketData {
//     name: string;
//     age: number;
// }

/**
 * Rooms
 * 
 * Socket.IO Rooms are similar to topics 
 */

/**
 * This handles the lifecycle of sockets and clients connected.
 */
export class SocketIOManager {
    
    ioServer!: Server;
    orgNamespace!: Namespace;
    isInitialised = false;

    constructor() {
        
    }

    ensureInitialised() {
        if (!this.isInitialised) {
            throw new Error("SocketIOManager is not initialised with a server!");
        }
    }

    initialise(server: NodejsServer) {
        // Set up listeners on the server
        // Socket IO
        this.ioServer = new Server(server);
        this.orgNamespace = this.ioServer.of(/^\/org-[0-z]+$/); // Organisation Scoped namespace

        // TODO: We'll have to apply some Auth here

        this.orgNamespace.on("connection", (socket) => {
            socket.emit("hello");
        });
        
        // Set up rooms (channels) for new connections

        this.isInitialised = true
    }

    getNamespaceOfOrg(org: Organisation) {
        this.ensureInitialised()
        return this.ioServer.of(`/org-${org._id}`);
    }

    publishMessage(org: Organisation, message: MessageLog) {
        this.publish(org, "messaging", message);
    }

    publish(org: Organisation, event: string, ...args: any) {
        this.ensureInitialised()

        console.log("[Socket IO Server] Publishing Event. Namespace:", `/org-${org._id}`, "Event:", event, "Args", ...args);

        const nsp = this.getNamespaceOfOrg(org);
        nsp.emit(event, ...args);
    }
}

export const SocketIOManagerInstance = new SocketIOManager();
