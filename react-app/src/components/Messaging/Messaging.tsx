import React, { Component, ReactElement, useEffect, useState } from "react";
import { TextArea } from "carbon-components-react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import produce from "immer"
import { Farmer, getAllFarmers } from "../../services/farmers";
import { Chat32, Send32 } from "@carbon/icons-react";
import { ConversationList, ConversationListProps } from "./ConversationList";
import { ConversationListItemProps } from "./ConversationListItem";
import { getAllMessages, MessageLog, sendMessageToFarmer } from "../../services/messageLog";
import { Conversation } from "./Conversation";

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

    const [messageText, setMessageText] = useState<string>("");

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

            // const messages: ConversationListItemProps[] = [{
            //     name: "Ryan Pereira",
            //     preview: "Hey How's the backyard farm going, I hear you're growing some chilli now!",
            //     isActive: true
            // }, {
            //     name: "Tyler Phillips",
            //     preview: "Tyler, just a reminder to keep those watermelons in check before the third impact!",
            //     isActive: false
            // }, {
            //     name: "Vess Natchev",
            //     preview: "Hi Vess, this is reminder to harvest your groundnuts before the rainy season starts.",
            //     isActive: false
            // }, {
            //     name: "Vikas Jagtrap",
            //     preview: "Hi Vikas, can you give me an update on how you're going with setting up your field",
            //     isActive: false
            // }, {
            //     name: "Michael Jacobs",
            //     preview: "Hey Michael, how did you go growing those tomato plants?!",
            //     isActive: false
            // }];

            // setMessages(messages);
        }

        load();
    }, []);

    function changeConversation(farmer_id: string) {
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
        {/* <TextArea labelText="Message" />
        <StatefulTable
            id="table"
            columns={columns}
            data={farmerTableData}
            view={view}
            actions={actions}
            options={options}
        /> */}

        <div className="flex flex-row h-[calc(100vh-96px)]">
            {/* Conversation List */}
            <div className="w-1/4 border-r-2 border-gray-300 border-solid">
                <ConversationList messages={conversations} onConversationChange={changeConversation} ></ConversationList>
            </div>
            {/* Conversation */}
            <div className="w-3/4 flex flex-col">
                <Conversation conversation={selectedConvo}></Conversation>
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