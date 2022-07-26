import React from "react";
import { MessageLog, Source } from "../../services/messageLog";
import { ConversationData } from "./Messaging";

export interface ConversationProps {
    conversation: ConversationData | null;
}

export function Conversation(props: ConversationProps) {

    // remove deuplicate group messages
    let messages: MessageLog[] | null = null;
    if (props.conversation && props.conversation.messages) {
        messages = [];
        for (let i = 0; i < props.conversation.messages.length; i++) {
            const message = props.conversation.messages[i];
            const existing = messages.find(it => it.group_id !== null && it.group_id === message.group_id && it.message === message.message);
            if (existing) {
                continue;
            }
            else {
                messages.push(message);
            }
            
            // messages.push(message);
        }
    }

    return <div className="flex flex-col justify-end h-full overflow-auto">
        {messages && messages.map(it => {
            if (it.source == Source.OpenHarvest) {
                return <div key={it._id} className="bg-[#3D3D3D] rounded-[7px] w-auto max-w-[70%] h-auto text-[13px] rounded-br-none px-[10px] py-[10px] self-end mb-[20px] text-white shadow">{it.message}</div>
            }
            else {
                return <div key={it._id} className="bg-[#cccccc] rounded-[7px] w-fit max-w-[70%] h-auto text-[13px] rounded-bl-none px-[10px] py-[10px] items-start mb-[20px] shadow">{it.message}</div>
            }
        })}
        {messages === null && <>
            
        </>}
    </div>
        
}