import React, { Component, ReactElement } from "react";
import { PageTitleBar, StatefulTable } from "carbon-addons-iot-react";
import { ITableColumnProperties, ITableRow } from "../../types/table";
import { Button } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";
import { Crop } from "../../services/crops";
import { ICropService } from "../../services/CropService";
import commonInjectableContainer from "../../common/di/inversify.config";
import TYPES from "../../common/di/inversify.types";

interface ICropTableRow extends ITableRow {
    values: Crop
}

type CropsProps = {};
type CropsState = {
    loading: boolean;
    data: ICropTableRow[];
};

export default class Crops extends Component<CropsProps, CropsState> {
    private readonly pageTitle = "Crops";
    private readonly noDataMessage = "No crops exists!";
    private readonly ROW_COUNT = 4;
    private readonly deleteId = "deleteId";
    private readonly deleteLabel = "Delete";
    private readonly cropService: ICropService = commonInjectableContainer.get(TYPES.CropService);

    constructor(props: CropsProps) {
        super(props);

        this.state = {
            loading: false,
            data: []
        };

        // handlers
        this.onApplyRowAction = this.onApplyRowAction.bind(this);
        this.addCrop = this.addCrop.bind(this);

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

            res.forEach(crop => {
                data.push({
                    id: crop._id.toString(),
                    values: crop,
                    rowActions: [{
                        id: this.deleteId,
                        labelText: this.deleteLabel,
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

    }

    addCrop(): void {

    }

    getColumns(): ITableColumnProperties[] {
        const columns: ITableColumnProperties[] = [
            {
                id: "sequenceNumber",
                isSortable: true,
                name: "Sequence"
            },
            {
                id: "name",
                isSortable: true,
                name: "Name"
            },
            {
                id: "startMonth",
                isSortable: true,
                name: "Season Start"
            },
            {
                id: "endMonth",
                isSortable: true,
                name: "Season End"
            },
            {
                id: "Time to harvest",
                isSortable: true,
                name: "Duration"
            },
            {
                id: "ongoing",
                isSortable: true,
                name: "Ongoing"
            },
            {
                id: "yields",
                isSortable: true,
                name: "Yields(sq meter)"
            },
        ];

        return columns;
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
                        onApplyRowAction: this.onApplyRowAction
                    }
                }}
                i18n={{
                    emptyMessage: this.noDataMessage
                }}
            />
    }

    render(): ReactElement {
        return (
            <PageTitleBar
            title={this.pageTitle}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
            content={this.getCropsTable()} />
        );
    }
}
