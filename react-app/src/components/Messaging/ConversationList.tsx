import React from "react";
import { ConversationListItem, ConversationListItemProps, NewConversation } from "./ConversationListItem";

export interface ConversationListProps {
    messages: ConversationListItemProps[];
    onConversationChange: (farmer_id: string) => void;
    inNewConvo: boolean;
    onNewConversation: () => void;
}

export function ConversationList(props: ConversationListProps) {

    return <div className="">
        {props.messages.map(it =>
            <ConversationListItem key={it.farmer_id} {...it} onClick={() => props.onConversationChange(it.farmer_id)} />
        )}
        <NewConversation isActive={props.inNewConvo} onClick={props.onNewConversation} />
    </div>
        
}