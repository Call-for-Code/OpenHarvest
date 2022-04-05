import React from "react";

export interface ConversationListItemProps {
    isActive: boolean;
    name: string;
    preview: string;
    farmer_id: string;
    onClick?: () => void;
}

export function ConversationListItem(props: ConversationListItemProps) {

    // return <div className={isActiveString}>
    return <div className={`py-5 hover:bg-[#e0e0e0] border-l-[3px] border-solid cursor-pointer ${props.isActive ? "border-[#4589ff]" : "border-transparent"}`} onClick={() => props.onClick && props.onClick()}>
        <div className="h-12 flex flex-row">
            <div className="w-12 h-12 mx-3 relative flex flex-none justify-center items-center rounded-full bg-red-500 text-xl text-white uppercase">{props.name.split(" ").map((n)=>n[0]).join("")}</div>
            <div className="flex flex-col justify-center item-start overflow-hidden">
                <span className="grow">{props.name}</span>
                <span className="grow truncate overflow-hidden">{props.preview}</span>
            </div>        
        </div>
    </div>
        
}