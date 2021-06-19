import { Component, OnInit } from "@angular/core";
import { ModalService } from "carbon-components-angular";
import { DashboardService } from "./dashboard.service";

interface DonutChartProps { group: string; value: number; }


@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {

    data: DonutChartProps[] = [];

    options = {
        "title": "Planted crops distribution",
        "resizable": true,
        "donut": {
            "center": {
                "label": "Land Area"
            }
        },
        "height": "500px"
    };

    data2 = [
        {
            "group": "Qty",
            "value": 65000
        },
        {
            "group": "More",
            "value": 29123
        },
        {
            "group": "Sold",
            "value": 35213
        },
        {
            "group": "Restocking",
            "value": 51213
        },
        {
            "group": "Misc",
            "value": 16932
        }
    ];
    options2 = {
        "title": "Vertical simple bar (discrete)",
        "axes": {
            "left": {
                "mapsTo": "value"
            },
            "bottom": {
                "mapsTo": "group",
                "scaleType": "labels"
            }
        },
        "height": "500px"
    };


    constructor(protected modalService: ModalService, private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getCropDistribution()
            .then(value => this.data = value.map(value1 => {
                return {
                    group: value1.crop,
                    value: value1.area
                };
            }))
            .catch(() => this.data = []);
    }
}
