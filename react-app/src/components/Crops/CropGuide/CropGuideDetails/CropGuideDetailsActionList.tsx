import React from 'react'
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { CropGuideAction } from "./../types";
import { CropGuideDetailsActionItem } from './CropGuideDetailsActionItem';

// a little function to help us with reordering the result
const reorder = (list: Iterable<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});

// I'm so sorry for these names
export interface CropGuideDetailsActionListProps {
    actions: CropGuideAction[];
    onUpdate: (actions: CropGuideAction[]) => void;
}

export function CropGuideDetailsActionList(props: CropGuideDetailsActionListProps) {

    function onDragEnd(result: DropResult, provided: ResponderProvided) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            props.actions,
            result.source.index,
            result.destination.index
        );

        props.onUpdate(items);
    }


    return <div>
        <h1>Actions</h1>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {props.actions.map((action, index) =>
                            <Draggable key={action.name} draggableId={action.name} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <CropGuideDetailsActionItem key={"item"+action.name} action={action} />
                                    </div>
                                )}
                            </Draggable>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>

    </div>
}