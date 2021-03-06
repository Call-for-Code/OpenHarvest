import axios from 'axios'
import { Farmer } from './farmers';

export enum Source {
    Farmer = "Farmer",
    OpenHarvest = "OpenHarvest",
    Other = "Other"
}

export interface MessageLog {
    _id?: string;
    farmer_id: string;
    /**
     * Address is just the generic way to refer to a phone number or and email.
     */
    address: string;
    message: string;
    status: string;
    source: Source
    timestamp: Date;
    /**
     * The Group this message belongs to
     */
    group_id: string | null;
    /**
     * For auditing purposes this is the message id from the service
     */
    messageRef: string;
}

export interface ThreadsDTO {
    /**
     * This is either the farmer_id or the group_id (depending on if this isn't a group thread or not)
     */
    thread_id: string;
    farmers: Farmer[];
    isGroup: boolean;
    preview: string;
    messages: MessageLog[];
}

export function getIndexFromFarmerIds(ids: string[]): string {
    return ids.join("|");
}

export function getFarmerIdsFromIndex(index: string): string[] {
    return index.split("|");
}

export async function getAllMessages(): Promise<MessageLog[]> {
    const res = await fetch("/api/messaging/");
    const data: MessageLog[] = await res.json();
    for (let i = 0; i < data.length; i++) {
        const message = data[i];
        message.timestamp = new Date(message.timestamp);
    }
    return data;
}

export async function getThreads(): Promise<ThreadsDTO[]> {
    const req = await axios.get("/api/messaging/threads");
    const data = req.data;
    return data;
}

export async function sendMessageToFarmer(farmer_id: string, message: string): Promise<MessageLog> {
    if (farmer_id == undefined || message == undefined) {
        throw new Error("Params are undefined!");
    }

    const req = await axios.post("/api/messaging/sendSMSToFarmer", {
        farmer_id,
        message
    });
    const data = req.data;
    return data;
}

export async function sendMessageToNewGroup(farmer_ids: string[], message: string) {
    const req = await axios.post<ThreadsDTO>("/api/messaging/new-thread", {
        farmer_ids,
        message
    });
    const data = req.data;
    return data;
}

export async function sendMessageToThread(thread_id: string, message: string) {
    const req = await axios.post<MessageLog>("/api/messaging/thread", {
        thread_id,
        message
    });
    const data = req.data;
    return data;
}
