import React, { Component, ReactElement } from "react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { IRenderDataFunctionArgs, ITableColumnProperties, ITableRow } from "../../types/table";
import { Button } from "carbon-components-react";
import { Add16, Checkmark16 } from "@carbon/icons-react";
import { Crop } from "../../services/crops";
import { ICropService } from "../../services/CropService";
import commonInjectableContainer from "../../common/di/inversify.config";
import TYPES from "../../common/di/inversify.types";
import produce from "immer";
import { MONTHS } from "../../helpers/constants";
import { MESSAGES } from "../../helpers/messages";
import CropForm from "./CropForm";

export interface ICropTableRow extends ITableRow {
    values: Crop
}

type CropsProps = {};
type CropsState = {
    loading: boolean;
    data: ICropTableRow[];
    dialogOpen: boolean;
    selectedCrop?: ICropTableRow;
};

export default class Crops extends Component<CropsProps, CropsState> {
    private readonly pageTitle = "Crops";
    private readonly noDataMessage = "No crops exists!";
    private readonly ROW_COUNT = 4;
    private readonly deleteId = "deleteId";

    private readonly cropService: ICropService = commonInjectableContainer.get(TYPES.CropService);

    constructor(props: CropsProps) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            dialogOpen: false
        };

        this.filterRowId = this.filterRowId.bind(this);

        // handlers
        this.onApplyRowAction = this.onApplyRowAction.bind(this);
        this.onRowClicked = this.onRowClicked.bind(this);
        this.addCrop = this.addCrop.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormCancel = this.onFormCancel.bind(this);

        // UI
        this.getCropsTable = this.getCropsTable.bind(this);
        this.getColumns = this.getColumns.bind(this);
    }

    componentDidMount() {
        this.setState({
            loading: true
        });

        this.cropService.findAll().then((res) => {
            const data: ICropTableRow[] = [];

            res.forEach((crop, index) => {
                data.push({
                    id: (index + 1).toString(10),
                    values: crop,
                    rowActions: [{
                        id: this.deleteId,
                        labelText: MESSAGES.DELETE,
                        isOverflow: true,
                        isDelete: true
                    }]
                });
            });

            this.setState({
                data
            });
        }).finally(() => {
            this.setState({
                loading: false
            });
        });
    }

    onApplyRowAction(action: string, rowId: string): void {
        if (action === this.deleteId) {
            const selectedCrop = this.state.data.find(row => row.id === rowId);

            if (selectedCrop?.values._id) {
                this.cropService.deleteCrop(selectedCrop.values._id)
                    .then(() => {
                        this.setState({
                            data: this.filterRowId(rowId)
                        });
                    })
                    .catch(() => {
                        // TODO: Add toast here and on success
                        console.log("Error while deleting crop!!!");
                    });
            } else {
                this.setState({
                    data: this.filterRowId(rowId)
                })
            }
        }
    }

    onRowClicked(rowId: string): void {
        const selectedCrop = this.state.data.find(row => row.id === rowId);

        if (selectedCrop) {
            this.setState({
                selectedCrop,
                dialogOpen: true
            });
        }
    }

    addCrop(): void {
        this.setState({
            dialogOpen: true,
            selectedCrop: undefined,
        });
    }

    getColumns(): ITableColumnProperties[] {
        return [
            {
                id: "sequenceNumber",
                isSortable: true,
                name: "Sequence",
                renderDataFunction: (args: IRenderDataFunctionArgs): JSX.Element => {
                    const seqNumber = Number.parseInt(args.rowId);
                    return <span>{seqNumber}</span>;
                }
            },
            {
                id: "name",
                isSortable: true,
                name: "Name"
            },
            {
                id: "startMonth",
                isSortable: true,
                name: "Season Start",
                renderDataFunction: (args: IRenderDataFunctionArgs): JSX.Element => {
                    const plantingSeason = args.row.planting_season;
                    return <span>{MONTHS[plantingSeason[0]]}</span>;
                }
            },
            {
                id: "endMonth",
                isSortable: true,
                name: "Season End",
                renderDataFunction: (args: IRenderDataFunctionArgs): JSX.Element => {
                    const plantingSeason = args.row.planting_season;
                    return <span>{MONTHS[plantingSeason[1]]}</span>;
                }
            },
            {
                id: "time_to_harvest",
                isSortable: true,
                name: "Time to harvest"
            },
            {
                id: "is_ongoing",
                isSortable: true,
                name: "Ongoing",
                renderDataFunction: (args: IRenderDataFunctionArgs): JSX.Element => {
                    return args.value == true ? <Checkmark16 /> : <span/>;
                }
            },
            {
                id: "yield_per_sqm",
                isSortable: true,
                name: "Yields(sq meter)"
            },
        ];
    }

    getCropsTable(): JSX.Element {
        const toolbarButtons = [];

        toolbarButtons.push(<Button key="add"
                                    size="small"
                                    kind="primary"
                                    renderIcon={Add16}
                                    onClick={this.addCrop}>Add</Button>);

        return <StatefulTable
                columns={this.getColumns()}
                data={this.state.data}
                view={{
                    toolbar: {
                        customToolbarContent: toolbarButtons
                    },
                    table: {
                        loadingState: {
                            isLoading: this.state.loading,
                            rowCount: this.ROW_COUNT
                        }
                    }
                }}
                actions={{
                    table: {
                        onApplyRowAction: this.onApplyRowAction,
                        onRowClicked: this.onRowClicked
                    }
                }}
                options={{
                    hasRowActions: true
                }}
                i18n={{
                    emptyMessage: this.noDataMessage
                }}
            />
    }

    onFormSubmit(row: ICropTableRow): void {
        const dataSize = this.state.data.length;

        const data = produce(this.state.data, draft => {
            const record = draft.find(r => r.id === row.id);
            if (record) {
                record.values = row.values;
            } else {
                row.id = (dataSize + 1).toString(10);
                row.rowActions = [{
                    id: this.deleteId,
                    labelText: MESSAGES.DELETE,
                    isOverflow: true,
                    isDelete: true
                }];
                draft.push(row);
            }
        });

        this.setState({
            data,
            dialogOpen: false,
            selectedCrop: undefined
        });
    }

    onFormCancel(): void {
        this.setState({
            dialogOpen: false,
            selectedCrop: undefined,
        });
    }

    render(): ReactElement {
        return (
            <PageTitleBar
            title={this.pageTitle}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
            content={
                <>
                    {
                        this.state.dialogOpen &&
                        <CropForm open={this.state.dialogOpen}
                                  selectedCrop={this.state.selectedCrop}
                                  onSubmit={this.onFormSubmit}
                                  onCancel={this.onFormCancel} />
                    }
                    { this.getCropsTable() }
                </>
            } />
        );
    }

    private filterRowId(rowId: string): ICropTableRow[] {
        const data: ICropTableRow[] = [];
        this.state.data.filter(row => row.id !== rowId).forEach((row, index) => {
            const modifiedRow = produce(row, draft => {
                draft.id = (index + 1).toString(10);
            });

            data.push(modifiedRow);
        });

        return data;
    }

}
