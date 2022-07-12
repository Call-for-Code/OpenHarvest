import { Send32 } from "@carbon/icons-react";
import { TextArea } from "carbon-components-react";
import React, { useEffect, useState } from "react";
import { Farmer, getAllFarmers } from "../../services/farmers";
import { ListBoxComponent } from "carbon-components-react";
import { useCombobox, useMultipleSelection } from "downshift";
import cx from "classnames";

/**
 * TODO: This should fetch the farmers dynamically from the servers after typing
 */
export interface NewConversationProps {
    farmers: Farmer[]
    onFarmerSelectionUpdated: (farmers: Farmer[]) => void;
}

const testFarmers: Farmer[] = [
    {
        _id: "1",
        name: "Ryan Pereira",
        address: "",
        coopOrganisations: [],
        fieldCount: 0,
        mobile: ""
    },
    {
        _id: "2",
        name: "Tutis Pereira",
        address: "",
        coopOrganisations: [],
        fieldCount: 0,
        mobile: ""
    },
    {
        _id: "3",
        name: "Colin Pereira",
        address: "",
        coopOrganisations: [],
        fieldCount: 0,
        mobile: ""
    },
]

export function NewConversation(props: NewConversationProps) {
    const [isLoading, setIsLoading] = useState(true);

    // const { farmers } = props;
    const farmers = testFarmers;

    const [farmerItems, setFarmerItems] = useState([...farmers])
    const [farmersAdded, setFarmersAdded] = useState<Farmer[]>([]);

    const {
        getSelectedItemProps,
        getDropdownProps,
        addSelectedItem,
        removeSelectedItem,
        selectedItems,
    } = useMultipleSelection({ initialSelectedItems: [farmers[0], farmers[1]] })
    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
        inputValue,
    } = useCombobox<Farmer>({
        items: farmerItems,
        itemToString(item) {
            return item ? item.name : ''
        },
        defaultHighlightedIndex: 0, // after selection, highlight the first item.
        selectedItem: null,
        stateReducer(state, actionAndChanges) {
            const { changes, type } = actionAndChanges

            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    return {
                        ...changes,
                        isOpen: !!changes.selectedItem, // keep the menu open after selection.
                    }
            }
            return changes
        },
        onStateChange({ inputValue, type, selectedItem }) {
            // here is where we filter on the items. First remove the ones already selected
            const noSelectedItems = farmers.filter(it => {
                return selectedItems.indexOf(it) < 0 || it !== selectedItem
            });
            let filteredItems = noSelectedItems;
            // Then filter by the names
            if (inputValue) {
                filteredItems = noSelectedItems.filter(it => it.name.toLowerCase().includes(inputValue.toLowerCase()))
            }

            setFarmerItems(filteredItems);

            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    if (selectedItem) {
                        addSelectedItem(selectedItem)
                        props.onFarmerSelectionUpdated(selectedItems);
                    }
                    break
                default:
                    break
            }

            
        },
    })

    function createConversation() {
        console.log("Message Text");
    }

    return <div className="flex flex-col h-full">
        <div className="w-full">
            <div className="flex flex-col gap-1">
                <label className="w-fit" {...getLabelProps()}>
                    Select a Farmer:
                </label>
                <div className="shadow-sm bg-white inline-flex gap-2 items-center flex-wrap p-1.5">
                    {selectedItems.map(function renderSelectedItem(
                        selectedItem,
                        index,
                    ) {
                        return (
                            <span
                                className="bg-gray-100 rounded-md px-1 focus:bg-red-400"
                                key={`selected-item-${index}`}
                                {...getSelectedItemProps({ selectedItem, index })}
                            >
                                {selectedItem.name}
                                <span
                                    className="px-1 cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation()
                                        removeSelectedItem(selectedItem)
                                    }}
                                >
                                    &#10005;
                                </span>
                            </span>
                        )
                    })}
                    <div className="flex gap-0.5 grow" {...getComboboxProps()}>
                        <input
                            className="w-full"
                            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
                        />
                        <button
                            aria-label="toggle menu"
                            className="px-2"
                            type="button"
                            {...getToggleButtonProps()}
                        >
                            &#8595;
                        </button>
                    </div>
                </div>
            </div>
            <ul
                {...getMenuProps()}
                className="absolute bg-white shadow-md max-h-80 overflow-scroll overflow-x-hidden w-3/4"
            >
                {isOpen &&
                    farmerItems.map((item, index) => (
                        <li
                            className={cx(
                                highlightedIndex === index && 'bg-blue-300',
                                selectedItem === item && 'font-bold',
                                'py-2 px-3 shadow-sm flex flex-col',
                            )}
                            key={`${item._id}${index}`}
                            {...getItemProps({ item, index })}
                        >
                            <span>{item.name}</span>
                        </li>
                    ))}
            </ul>
        </div>
        <div className="flex-grow"></div>
    </div>

}