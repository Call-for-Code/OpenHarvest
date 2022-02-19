
export type Noop = () => void;

export const noop: Noop = () => {
    return;
};

export const nbsp = "\xa0";

export enum FormMode {
    ADD = "add",
    EDIT = "edit",
    DUPLICATE = "duplicate",
    VIEW = "view"
}
