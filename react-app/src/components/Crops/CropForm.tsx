import React, { BaseSyntheticEvent, Component } from "react";
import { ICropTableRow } from "./Crops";
import { FormField, FormValueType, IFormFieldStates } from "../../types/form";
import { MESSAGES } from "../../helpers/messages";
import { createFormState, IFormService } from "../../helpers/FormService";
import { ICropService } from "../../services/CropService";
import commonInjectableContainer from "../../common/di/inversify.config";
import TYPES from "../../common/di/inversify.types";
import { Checkbox, Column, Grid, NumberInput, Row, Select, SelectItem, SelectItemProps, TextInput } from "carbon-components-react";
import { MONTHS } from "../../helpers/constants";
import { ComposedModal } from "carbon-addons-iot-react";
import { Crop } from "../../services/crops";

type CropFormProps = {
    selectedCrop?: ICropTableRow;
    open: boolean;
    onSubmit: (cropRow: ICropTableRow) => void;
    onCancel: () => void;
};

type CropFormState = {
    fieldStates: IFormFieldStates;
};

export default class CropForm extends Component<CropFormProps, CropFormState> {
    private readonly cropService: ICropService = commonInjectableContainer.get(TYPES.CropService);
    private readonly formService: IFormService = commonInjectableContainer.get(TYPES.FormService);

    private formFields: FormField[];
    private readonly deleteId = "deleteId";

    private readonly plantingSeasonOptions: SelectItemProps[] = MONTHS.map((value, index) => {
        return {
            text: value,
            value: index
        };
    });

    constructor(props: CropFormProps) {
        super(props);

        this.formFields = CropForm.getFormFields();

        this.state = {
            fieldStates: createFormState(this.formFields),
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePlantingSeasonStartChange = this.handlePlantingSeasonStartChange.bind(this);
        this.handlePlantingSeasonEndChange = this.handlePlantingSeasonEndChange.bind(this);
        this.handleOngoingChange = this.handleOngoingChange.bind(this);
        this.handleYieldsChange = this.handleYieldsChange.bind(this);
        this.handleTimeToHarvestChange = this.handleTimeToHarvestChange.bind(this);

        this.isSelected = this.isSelected.bind(this);

    }

    componentDidMount() {
        this.formFields = CropForm.getFormFields();
        let fieldStates: IFormFieldStates = createFormState(this.formFields);

        if (this.props.selectedCrop) {
            const cropValues = this.props.selectedCrop.values;

            const values = {
                "name": cropValues.name,
                "timeToHarvest": cropValues.time_to_harvest,
                "plantingSeasonStart": cropValues.planting_season.length > 0 ? cropValues.planting_season[0] : 0,
                "plantingSeasonEnd": cropValues.planting_season.length > 1 ? cropValues.planting_season[1] : 0,
                "ongoing": cropValues.is_ongoing,
                "yields": cropValues.yield_per_sqm
            };

            fieldStates = this.formService.loadFormValues(fieldStates, values);
        }

        this.setState({
            fieldStates
        });
    }

    handleNameChange(event: BaseSyntheticEvent): void {
        this.handleFormFieldChangeFromValue(event.target.value, "name");
    }

    handleTimeToHarvestChange(event: any): void {
        this.handleFormFieldChangeFromValue(event.imaginaryTarget.value, "timeToHarvest");
    }

    handlePlantingSeasonStartChange(event: BaseSyntheticEvent): void {
        this.handleFormFieldChangeFromValue(event.target.value, "plantingSeasonStart");
    }

    handlePlantingSeasonEndChange(event: BaseSyntheticEvent): void {
        this.handleFormFieldChangeFromValue(event.target.value, "plantingSeasonEnd");
    }

    handleOngoingChange(value: boolean): void {
        this.handleFormFieldChangeFromValue(value, "ongoing");
    }

    handleYieldsChange(event: BaseSyntheticEvent): void {
        this.handleFormFieldChangeFromValue(event.target.value, "yields");
    }

    handleClose(): void {
        this.props.onCancel();
    }

    handleSubmit(): void {
        const values: Crop = {
            name: this.state.fieldStates["name"].value as string,
            planting_season: [this.state.fieldStates["plantingSeasonStart"].value as number, this.state.fieldStates["plantingSeasonEnd"].value as number],
            time_to_harvest: this.state.fieldStates["timeToHarvest"].value as number,
            is_ongoing: this.state.fieldStates["ongoing"].value as boolean,
            yield_per_sqm: this.state.fieldStates["yields"].value as number
        };

        const modifiedData: ICropTableRow = {
            id: this.props.selectedCrop?.id || "",
            values,
            rowActions: [{
                id: this.deleteId,
                labelText: MESSAGES.DELETE,
                isOverflow: true,
                isDelete: true
            }]
        };

        this.props.onSubmit(modifiedData);
    }

    isFormInvalid(): boolean {
        return false;
    }

    getTitle(): string {
        return this.props.selectedCrop ? MESSAGES.EDIT_CROP : MESSAGES.ADD_CROP;
    }

    isSelected(fieldName: string, value: string): boolean {
        return this.state.fieldStates[fieldName].value === value;
    }

    render(): JSX.Element {
        return <ComposedModal
            open={this.props.open}
            header={{
                title: this.getTitle(),
                label: ""
            }}
            onClose={this.handleClose}
            onSubmit={this.handleSubmit}
            type={"normal"}
            footer={{
                primaryButtonLabel: MESSAGES.SAVE,
                secondaryButtonLabel: MESSAGES.CANCEL,
                isPrimaryButtonDisabled: this.isFormInvalid()
            }}
        >
            <Grid>
                <Row>
                    <Column>
                        <TextInput id="name" labelText="Name" value={this.state.fieldStates["name"].value as string} onChange={this.handleNameChange} />
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Select
                            id="plantingSeasonStart"
                            labelText="Planting Season Start"
                            onChange={this.handlePlantingSeasonStartChange}
                            value={this.state.fieldStates["plantingSeasonStart"].value as number}>
                            {
                                this.plantingSeasonOptions
                                    .map(option =>
                                        <SelectItem
                                            key={option.value}
                                            text={option.text}
                                            value={option.value}/>)
                            }
                        </Select>
                    </Column>
                    <Column>
                        <Select
                            id="plantingSeasonEnd"
                            labelText="Planting Season End"
                            onChange={this.handlePlantingSeasonEndChange}
                            value={this.state.fieldStates["plantingSeasonEnd"].value as number}>
                            {
                                this.plantingSeasonOptions.map(option =>
                                    <SelectItem
                                        key={option.value}
                                        text={option.text}
                                        value={option.value}/>)
                            }
                        </Select>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <NumberInput
                            min={0}
                            step={1}
                            id="timeToHarvest"
                            label="Time to Harvest"
                            value={this.state.fieldStates["timeToHarvest"].value as number}
                            onChange={this.handleTimeToHarvestChange} />
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Checkbox id="ongoing" labelText="Ongoing" checked={this.state.fieldStates["ongoing"].value as boolean} onChange={this.handleOngoingChange} />
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <TextInput id="yields" labelText="Yields" value={this.state.fieldStates["yields"].value as string} onChange={this.handleYieldsChange} />
                    </Column>
                </Row>
            </Grid>
        </ComposedModal>;
    }

    private static getFormFields(): FormField[] {
        return [
            {
                name: "name",
                required: true
            },
            {
                name: "timeToHarvest",
                required: true,
                numeric: {
                    allowEmpty: false
                }
            },
            {
                name: "plantingSeasonStart",
                required: true,
                numeric: {
                    allowEmpty: false
                }
            },
            {
                name: "plantingSeasonEnd",
                required: true,
                numeric: {
                    allowEmpty: false
                }
            },
            {
                name: "ongoing",
                required: false
            },
            {
                name: "yields",
                numeric: {
                    allowEmpty: false,
                    min: 0
                }
            }
        ];
    }

    private handleFormFieldChangeFromValue(value: FormValueType, columnName: string): void {
        if (!this.state.fieldStates) {
            return;
        }

        const fieldStates = this.formService.updateFormStateFromValue(this.state.fieldStates, columnName, value);
        this.setState({ fieldStates });
    }

}