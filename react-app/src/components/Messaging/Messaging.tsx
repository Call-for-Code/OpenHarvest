import React, { Component, ReactElement, useEffect, useState } from "react";
import { TextArea } from "carbon-components-react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import produce from "immer"
import { Farmer, getAllFarmers } from "../../services/farmers";
import { Chat32, Send32 } from "@carbon/icons-react";
import { ConversationList, ConversationListProps } from "./ConversationList";
import { ConversationListItemProps, NewConversationListItem } from "./ConversationListItem";
import { getAllMessages, MessageLog, sendMessageToFarmer } from "../../services/messageLog";
import { SocketIOClientInstance } from "./../../services/socket.io";
import { Conversation } from "./Conversation";
import { NewConversation } from "./NewConversation";

export interface ConversationData {
    name: string;
    farmer_id: string;
    preview: string;
    isActive: boolean;
    messages: MessageLog[]
}

export function Messaging() {

    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [messageLog, setMessageLog] = useState<MessageLog[]>([]);
    const [conversationList, setConversationList] = useState<ConversationListItemProps[]>([]);

    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<ConversationData | null>(null);

    const [inNewConvo, setInNewConvo] = useState(false);

    const [messageText, setMessageText] = useState<string>("");

    // Register EventEmitter Event Handlers
    useEffect(() => {
        const onMessage = (message: MessageLog) => {
            console.log("Messaging OnMessage");

            const messagesFarmer = farmers.find(it => it._id == message.farmer_id);
            if (messagesFarmer == undefined) {
                throw new Error("Unknown Farmer in Message!");
            }

            setConversations(produce(draftConvos => {
                console.log(conversations);

                // Get the message's farmer and at it to them
                const farmer_id = message.farmer_id;
                const farmerConvo = draftConvos.find(it => it.farmer_id === farmer_id);
                if (farmerConvo) {
                    // We can add it directly
                    farmerConvo.messages.push(message);
                }
                else {
                    // We need to construct a new Conversation Data item and add it
                    const name = messagesFarmer.name;
                    const preview = message.message;

                    draftConvos.push({
                        name,
                        farmer_id,
                        preview,
                        isActive: false,
                        messages: [message]
                    });
                }
                console.log(draftConvos);
            }));

            // Update the Selected convo just incase that's the one that changed
            if (selectedConvo!!.farmer_id == message.farmer_id) {
                setSelectedConvo(produce(draftConvo => {
                    draftConvo!!.messages.push(message)
                }));
            }
        }

        SocketIOClientInstance.on("messaging", onMessage);

        return () => {
            SocketIOClientInstance.off("messaging", onMessage);    
        }
    }, []);

    useEffect(() => {
        async function load() {
            const farmers = await getAllFarmers();
            setFarmers(farmers);

            const messages = await getAllMessages();
            setMessageLog(messages);

            console.log(messages);

            const convos = [];
            const farmerToMessageLogMap: any = {};
            
            // Group by farmer_id
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                if (message.farmer_id in farmerToMessageLogMap) {
                    farmerToMessageLogMap[message.farmer_id].push(message);
                }
                else {
                    farmerToMessageLogMap[message.farmer_id] = [message];
                }
            }

            // Make conversations
            for (const farmer_id in farmerToMessageLogMap) {
                const messageLogs: MessageLog[] = farmerToMessageLogMap[farmer_id];
                messageLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
                
                const farmerInfo = farmers.find(it => it._id == farmer_id);
                if (farmerInfo == undefined) {
                    throw new Error("Unknown Farmer in Message!");
                }
                const name = farmerInfo.name;
                const preview = messageLogs[messageLogs.length - 1].message;

                convos.push({
                    name,
                    farmer_id,
                    preview,
                    isActive: false,
                    messages: messageLogs
                });
            }

            convos[0].isActive = true;
            setSelectedConvo(convos[0]);
            setConversations(convos);

        }

        load();
    }, []);

    function changeConversation(farmer_id: string) {
        setInNewConvo(false);


        const convo = conversations.find(it => it.farmer_id === farmer_id);
        selectedConvo!!.isActive = false;
        convo!!.isActive = true;

        setSelectedConvo(convo!!);
        
    }

    // Sends a message on the selected conversation
    async function sendMessage() {
        const message = messageText;

        const farmer = selectedConvo!!.farmer_id;
        const messageLog = await sendMessageToFarmer(farmer, message)

        setSelectedConvo(produce(draftConvo => {
            draftConvo!!.messages.push(messageLog);
        }));        
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
                    <NewConversation farmers={farmers} onFarmerSelectionUpdated={(farmers => console.log(farmers))} />
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