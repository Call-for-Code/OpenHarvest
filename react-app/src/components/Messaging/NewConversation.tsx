import { Send32 } from "@carbon/icons-react";
import { TextArea } from "carbon-components-react";
import React, { useState } from "react";
import { Farmer } from "../../services/farmers";
import { Source } from "../../services/messageLog";
import { ConversationData } from "./Messaging";

/**
 * TODO: This should fetch the farmers dynamically from the servers after typing
 */
export interface NewConversationProps {
    farmers: Farmer[]
}

export function NewConversation(props: NewConversationProps) {

    const [users, setUsers] = useState([])

    return <div className="flex flex-row">
        <TextArea placeholder="Message" labelText="" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
        <div className="w-1/12 flex flex-col justify-center items-center hover:bg-[#e0e0e0] cursor-pointer" onClick={sendMessage}>
            <Send32/>
        </div>
    </div>
        
}