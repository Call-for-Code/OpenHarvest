export type FormValueType = string | number | boolean;

export interface IFormValues {
    [field: string]: FormValueType | undefined;
}

export type Numeric = {
    min?: number;
    max?: number;
    allowEmpty?: boolean;
    allowDecimals?: boolean;
};

export type Collection = {
    min?: number;
    max?: number;
};

export interface IFormFieldState {
    value?: string | number | boolean;
    maxLength?: number;
    state: {
        dirty: boolean;
        valid: boolean;
        invalidText?: string;
        duplicate?: boolean;
    };
    label?: string;
    excludedValues?: string[];
    formField?: FormField;
}

export interface IFormFieldStates {
    [columnName: string]: IFormFieldState;
}

export type I18nMessage = string | ((value?: FormValueType) => string);

export type FormField = {
    name: string;
    maxLength?: number;
    required?: boolean;
    numeric?: Numeric;
    collection?: Collection;
    validationFunction?: (value: FormValueType, fieldStates: IFormFieldStates) => string | undefined;
    invalidMessages?: {
        required?: I18nMessage;
        maxLength?: I18nMessage;
    };
};
