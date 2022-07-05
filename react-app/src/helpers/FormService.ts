import { injectable } from "inversify";
import { FormField, FormValueType, IFormFieldState, IFormFieldStates, IFormValues } from "../types/form";
import { BaseSyntheticEvent } from "react";
import produce from "immer";

export const createFormState = (fields: FormField[]): IFormFieldStates => {
    const cleanForm: IFormFieldStates = {};
    fields.forEach(field => {
        cleanForm[field.name] = {state: {dirty: false, valid: true}, formField: field};
    });
    return cleanForm;
};

export const isDefined = <T>(value: T | null | undefined): value is T => {
    return value !== undefined && value != null;
};

export const isUndefined = <T>(value: T | null | undefined): value is undefined | null => {
    return value === undefined || value == null;
};

export interface IFormService {
    getInputFormFields: (fields: FormField[], table: string, values?: IFormValues) => Promise<IFormFieldStates>;
    updateFormStateOnChange: (currentState: IFormFieldStates, columnName: string, event: BaseSyntheticEvent, existingValues?: FormValueType[]) => IFormFieldStates;
    updateFormStateFromValue: (currentState: IFormFieldStates, columnName: string, value?: FormValueType) => IFormFieldStates;
    updateFormState: (currentState: IFormFieldStates, columnName: string, dirty: boolean, value?: FormValueType, valid?: boolean, existingValues?: FormValueType[]) => IFormFieldStates;
    loadFormValues: (state: IFormFieldStates, values: IFormValues) => IFormFieldStates;
    isFormNotSavable: (state: IFormFieldStates) => boolean;
    isFormDirty: (state: IFormFieldStates) => boolean;
    getFieldInvalidMessage: (columnName: string, fieldState: IFormFieldState, fieldStates: IFormFieldStates) => string | undefined;
}

@injectable()
export class FormService implements IFormService {
    private readonly invalidNumberMsg = "Invalid number";
    private readonly invalidWholeNumberMsg = "Invalid whole number";
    private readonly cannotBeEmptyMsg ="Field cannot be empty";
    private readonly invalidNumberRange = "Numbers are not in valid range";
    private readonly valueIsTooLong = "Value is too long";

    getFieldInvalidMessage(columnName: string, fieldState: IFormFieldState, fieldStates: IFormFieldStates): string | undefined {
        const value = fieldState.value;
        let message = this.validateNumeric(fieldState, fieldState.label || columnName, value?.toString());

        if (message) {
            return message;
        }

        if (fieldState.formField?.required) {
            message = this.validateRequiredAndTooLong(fieldState, fieldState.label || columnName, value?.toString());
        } else {
            message = this.validateTooLong(fieldState, fieldState.label || columnName, value);
        }

        if (message) {
            return message;
        }

        if (fieldState.formField?.validationFunction && isDefined(value)) {
            return fieldState.formField.validationFunction(value.toString(), fieldStates);
        }

        return undefined;
    }

    getInputFormFields(fields: FormField[], table: string, values: IFormValues | undefined): Promise<IFormFieldStates> {
        const cleanForm = createFormState(fields);

        fields.forEach(field => {
            const fieldName= field.name;
            if (values) {
                cleanForm[fieldName].value = values[fieldName];
            }
        });

        return Promise.resolve(cleanForm);
    }

    isFormDirty(states: IFormFieldStates): boolean {
        const dirtyField = Object.values(states).find(fieldSet => {
            return fieldSet.state.dirty;
        });

        return isDefined(dirtyField);
    }

    isFormNotSavable(states: IFormFieldStates): boolean {
        const invalidField = Object.values(states).find(fieldSet => {
            const fieldInvalidMessage = this.getFieldInvalidMessage(fieldSet.formField?.name || "", fieldSet, states);
            return isDefined(fieldInvalidMessage) || !fieldSet.state.valid;
        });

        if (isDefined(invalidField)) {
            // console.log("Field Invalid", invalidField);
            return true;
        }

        return !this.isFormDirty(states);
    }

    loadFormValues(state: IFormFieldStates, values: IFormValues): IFormFieldStates {
        return produce(state, draft => {
            Object.keys(draft).forEach(field => {
                draft[field].value = values[field];
            });
            return draft;
        });
    }

    updateFormState(currentState: IFormFieldStates, columnName: string, dirty: boolean, value?: FormValueType, valid?: boolean, existingValues?: FormValueType[]): IFormFieldStates {
        return produce(currentState, draft => {
            const fieldState = draft[columnName];
            fieldState.value = value;
            fieldState.state.dirty = fieldState.state.dirty || dirty;
            fieldState.state.duplicate = isDefined(existingValues) && isDefined(value) ? existingValues.includes(value) : false;
            const invalidText: string | undefined = this.getFieldInvalidMessage(columnName, fieldState, draft);
            fieldState.state.invalidText = invalidText;
            fieldState.state.valid = isDefined(invalidText) ? false : isUndefined(valid) || valid ;
        });
    }

    updateFormStateFromValue(currentState: IFormFieldStates, columnName: string, value?: FormValueType, existingValues?: FormValueType[]): IFormFieldStates {
        return this.updateFormState(currentState, columnName, true, value, undefined, existingValues);
    }

    updateFormStateOnChange(currentState: IFormFieldStates, columnName: string, event: React.BaseSyntheticEvent, existingValues?: FormValueType[]): IFormFieldStates {
        return this.updateFormStateFromValue(currentState, columnName, event.target.value, existingValues);
    }

    private validateNumeric(fieldState: IFormFieldState, columnLabel: string, value?: string): string | undefined {
        if (!fieldState.formField) {
            return undefined;
        }

        const {required, numeric} = fieldState.formField;
        if (isUndefined(numeric)) {
            return undefined;
        }

        const isUndefinedOrEmpty = isUndefined(value) || (value.trim().length === 0);

        if (isUndefinedOrEmpty) {
            if (!required && numeric?.allowEmpty) {
                return undefined;
            }
            return required ? this.cannotBeEmptyMsg : this.invalidNumberMsg;
        }

        const numberValue = Number(value);

        if (isNaN(numberValue)) {
            return this.invalidNumberMsg;
        }

        const regex = /^\d+$/;
        if (!numeric.allowDecimals && (!Number.isInteger(numberValue) || !value?.match(regex)) ) {
            return this.invalidWholeNumberMsg;
        }

        const min = numeric?.min;
        const max = numeric?.max;

        const isMinDefined = isDefined(min);
        const isMaxDefined = isDefined(max);

        if (isMinDefined && isMaxDefined && (numberValue < min  || numberValue > max)) {
            return this.invalidNumberRange;
        } else if (isMinDefined && numberValue < min) {
            return this.invalidNumberRange;
        } else if (isMaxDefined && numberValue > max) {
            return this.invalidNumberRange;
        }

        return undefined;
    }

    private validateRequiredAndTooLong(fieldState: IFormFieldState, columnLabel: string, value?: FormValueType): string | undefined {
        return this.validateRequired(fieldState, columnLabel, value) ||
            this.validateTooLong(fieldState, columnLabel, value);
    }

    private validateRequired(fieldState: IFormFieldState, columnLabel: string, value?: FormValueType): string | undefined {
        if (fieldState.state.dirty && (isUndefined(value) || (value.toString().trim().length === 0))) {

            const requiredMessage = fieldState.formField?.invalidMessages?.required;

            if (isDefined(requiredMessage)) {
                if (typeof requiredMessage === "string") {
                    return requiredMessage;
                }
                return requiredMessage(value);
            }


            return this.cannotBeEmptyMsg;
        }
    }

    private validateTooLong(fieldState: IFormFieldState, columnLabel: string, value?: FormValueType): string | undefined {

        if (isUndefined(fieldState.maxLength) || isUndefined(value)) {
            return undefined;
        }

        const length = "boolean" === typeof value ? 1 : value.toString().length;

        if (length > fieldState.maxLength) {
            return this.valueIsTooLong;
        }
        return undefined;
    }

}