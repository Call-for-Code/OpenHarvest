import React, { Component, ReactElement, useEffect, useState } from "react";
import { TextArea } from "carbon-components-react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import produce from "immer"
import { Farmer, getAllFarmers } from "../../services/farmers";
import { Chat32, Send32 } from "@carbon/icons-react";
import { ConversationList, ConversationListProps } from "./ConversationList";
import { ConversationListItemProps, NewConversationListItem } from "./ConversationListItem";
import { getAllMessages, getIndexFromFarmerIds, getThreads, MessageLog, sendMessageToFarmer, sendMessageToNewGroup, sendMessageToThread, ThreadsDTO } from "../../services/messageLog";
import { SocketIOClientInstance } from "./../../services/socket.io";
import { Conversation } from "./Conversation";
import { NewConversation } from "./NewConversation";

export interface ConversationData {
    name: string;
    thread_id: string;
    preview: string;
    isActive: boolean;
    messages: MessageLog[]
}

export function Messaging() {

    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [threads, setThreads] = useState<ThreadsDTO[]>([])

    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<ConversationData | null>(null);

    const [inNewConvo, setInNewConvo] = useState(false);
    const [newConvoFarmers, setNewConvoFarmers] = useState<Farmer[]>([])

    const [messageText, setMessageText] = useState<string>("");

    // Register EventEmitter Event Handlers
    useEffect(() => {
        const onMessage = (message: MessageLog) => {
            console.log("Messaging OnMessage", message);

            const messagesFarmer = farmers.find(it => it._id == message.farmer_id);
            if (messagesFarmer == undefined) {
                console.log(farmers, message.farmer_id);
                console.error("Unknown Farmer in Message!");
                return;
            }

            const existingThread = threads.find(it => it.thread_id === message.farmer_id);
            if (existingThread) {
                existingThread.messages.push(message);
            }
            else {
                // Create thread
                const thread = {
                    thread_id: message.farmer_id,
                    farmers: [messagesFarmer],
                    isGroup: false,
                    preview: messageText,
                    messages: [message]
                }
                threads.push(thread);
            }

            const newThreads = [...threads];
            setThreads(newThreads);
            generateConversations(newThreads);

            if (selectedConvo && selectedConvo.thread_id == message.farmer_id) {
                const newConvo = conversations.find(it => it.thread_id === message.farmer_id);
                setSelectedConvo(newConvo!!);
            }
            

            // Update the Selected convo just incase that's the one that changed
            // if (selectedConvo && selectedConvo.thread_id == message.farmer_id) {
            //     setSelectedConvo(produce(draftConvo => {
            //         draftConvo!!.messages.push(message)
            //     }));
            // }
        }

        SocketIOClientInstance.on("messaging", onMessage);

        return () => {
            SocketIOClientInstance.off("messaging", onMessage);    
        }
    }, [farmers]);

    async function generateConversations(threads: ThreadsDTO[]) {
        // Transform threads to conversation data
        const convos: ConversationData[] = threads.map(thread => {
            const name = thread.isGroup ? thread.farmers.map(it => it.name).join(", ") : thread.farmers[0].name;
            return {
                name,
                thread_id: thread.thread_id,
                preview: thread.preview,
                isActive: false,
                messages: thread.messages
            }
        });

        console.log("Convos", convos);
        
        if (convos.length > 0) {
            convos[0].isActive = true;
            setSelectedConvo(convos[0]);
            setInNewConvo(false);
        }
        else {
            setSelectedConvo(null);
            setInNewConvo(true);
        }
        setConversations(convos);
    }

    async function load() {
        const farmers = await getAllFarmers();
        setFarmers(farmers);

        const threads = await getThreads();
        setThreads(threads);

        console.log(threads);
        
        generateConversations(threads);
    }

    useEffect(() => {        
        load();
    }, []);

    function changeConversation(farmer_id: string) {
        setInNewConvo(false);

        const convo = conversations.find(it => it.thread_id === farmer_id);
        selectedConvo!!.isActive = false;
        convo!!.isActive = true;

        setSelectedConvo(convo!!);
        
    }

    // Sends a message on the selected conversation
    async function sendMessage() {
        if (messageText === "") {
            console.error("Message is empty!");
            return;
        }

        if (inNewConvo) {
            // Create the convo and get it from the server
            const farmers = newConvoFarmers;
            const isGroup = farmers.length > 1;
            
            const farmer_ids = farmers.map(it => it._id!!);
            const thread_id = getIndexFromFarmerIds(farmer_ids);

            let thread: ThreadsDTO;
            if (isGroup) {
                thread = await sendMessageToNewGroup(farmer_ids, messageText);
            }
            else {
                const messageLog = await sendMessageToThread(thread_id, messageText);
                // Create thread
                thread = {
                    thread_id,
                    farmers: farmers,
                    isGroup: farmers.length > 1,
                    preview: messageText,
                    messages: [messageLog]
                }
            }

            console.log(farmers.map(it => it.name), messageText);


            const newThreads = [...threads, thread];
            setThreads(newThreads);
            generateConversations(newThreads);
        }
        else {
            const message = messageText;
    
            const farmer = selectedConvo!!.thread_id;
            const messageLog = await sendMessageToFarmer(farmer, message);
    
            setSelectedConvo(produce(draftConvo => {
                draftConvo!!.preview = messageLog.message;
                draftConvo!!.messages.push(messageLog);
            }));
        }
        setMessageText("");
    }


    /**
     * Layout:
     * Text Area For the message
     * Table with Farmers
     * 
     * User can select multiple farmers and send out a message to them using batch actions
     */
    return <div className="flex flex-col">
        <PageTitleBar
            title={"Conversations"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />

        <div className="flex flex-row h-[calc(100vh-96px)]">
            {/* Conversation List */}
            <div className="w-1/4 border-r-2 border-gray-300 border-solid">
                <ConversationList 
                    messages={conversations} 
                    onConversationChange={changeConversation}
                    inNewConvo={inNewConvo}
                    onNewConversation={() => setInNewConvo(true)} />
            </div>
            {/* Conversation */}
            <div className="w-3/4 flex flex-col">
                {inNewConvo ? 
                    <NewConversation farmers={farmers} onFarmerSelectionUpdated={(farmers) => {console.log(farmers.map(it => it.name)); setNewConvoFarmers(farmers)}} />
                :
                    <Conversation conversation={selectedConvo}></Conversation>
                }
                
                <div className="flex flex-row">
                    <TextArea placeholder="Message" labelText="" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
                    <div className="w-1/12 flex flex-col justify-center items-center hover:bg-[#e0e0e0] cursor-pointer" onClick={sendMessage}>
                        <Send32/>
                    </div>
                </div>
            </div>
            <div>
        </div>

        </div>
    </div>
}