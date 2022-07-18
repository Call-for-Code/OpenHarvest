import React from "react";
import { ConversationListItem, ConversationListItemProps, NewConversationListItem } from "./ConversationListItem";

export interface ConversationListProps {
    messages: ConversationListItemProps[];
    onConversationChange: (thread_id: string) => void;
    inNewConvo: boolean;
    onNewConversation: () => void;
}

export function ConversationList(props: ConversationListProps) {

    return <div className="">
        {props.messages.map(it =>
            <ConversationListItem key={it.thread_id} {...it} onClick={() => props.onConversationChange(it.thread_id)} />
        )}
        <NewConversationListItem isActive={props.inNewConvo} onClick={props.onNewConversation} />
    </div>
        
}