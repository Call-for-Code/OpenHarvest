import { CarbonIconType } from "@carbon/icons-react";

export interface IRenderDataFunctionArgs {
    value: any;
    columnId: string;
    rowId: string;
    row: {
        [columnId: string]: any;
    };
}

export interface IEditDataFunctionArgs {
    value: any;
    columnId: string;
    rowId: string;
    row: {[columnId: string]: any};
}

export interface ITableColumnProperties {
    id: string;
    isSortable: boolean;
    name: string;
    renderDataFunction?: (args: IRenderDataFunctionArgs) => JSX.Element;
    width?: string;
    tooltip?: string;
    isFilterable?: boolean;
    editDataFunction?: (args: IEditDataFunctionArgs) => JSX.Element;
    sortFunction?: any;
    align?: "start" | "center" | "end";
}

export interface ITableRow {
    id: string;
    rowActions?: IRowAction[];
    values: {[key: string]: any};
    isSelectable?: boolean;
}

export interface IRowAction {
    id: string;
    disabled?: boolean;
    labelText?: string;
    isOverflow: boolean;
    renderIcon?: CarbonIconType;
    iconDescription?: string;
    isDelete?: boolean;
    isEdit?: boolean;
    hasDivider?: boolean;
}
