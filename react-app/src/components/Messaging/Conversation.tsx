import React from "react";
import { Source } from "../../services/messageLog";
import { ConversationData } from "./Messaging";

export interface ConversationProps {
    conversation: ConversationData | null;
}

export function Conversation(props: ConversationProps) {

    return <div className="flex flex-col justify-end h-full">
        {props.conversation && props.conversation.messages.map(it => {
            if (it.source == Source.OpenHarvest) {
                return <div key={it._id} className="bg-[#3D3D3D] rounded-[7px] w-auto max-w-[70%] h-auto text-[13px] rounded-br-none px-[10px] py-[10px] self-end mb-[20px] text-white shadow">{it.message}</div>
            }
            else {
                return <div key={it._id} className="bg-[#cccccc] rounded-[7px] w-fit max-w-[70%] h-auto text-[13px] rounded-bl-none px-[10px] py-[10px] items-start mb-[20px] shadow">{it.message}</div>
            }
        })}
        {props.conversation === null && <>
            
        </>}
    </div>
        
}