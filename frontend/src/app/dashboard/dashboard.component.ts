import { Component, OnInit } from "@angular/core";
import { ModalService } from "carbon-components-angular";
import { DashboardService } from "./dashboard.service";

interface DonutChartProps { group: string; value: number; }
interface AreaChartProps { group: string; date: Date; value: number; }
interface LineChartProps { group: string; date: Date; value: number; }

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
                "label": "Land Area (kha)"
            }
        },
        "legend": {
            "alignment": "center"
        },
        "data": {
            "loading": true
        },
        "height": "500px"
    };

    data2: AreaChartProps[] = [];
    options2 = {
        "title": "Crop production - forecast",
        "axes": {
            "left": {
                "stacked": true,
                "scaleType": "linear",
                "mapsTo": "value",
                "title": "Yield (kt)",
            },
            "bottom": {
                "title": "Time",
                "scaleType": "time",
                "mapsTo": "date"
            }
        },
        "legend": {
            "alignment": "center"
        },
        "data": {
            "loading": true
        },
        "curve": "curveMonotoneX",
        "height": "500px"
    };

    data3: LineChartProps[] = [];
    options3 = {
        "title": "Crop production - forecast",
        "axes": {
            "left": {
                "stacked": true,
                "scaleType": "linear",
                "mapsTo": "value",
                "title": "Yield (kt)",
            },
            "bottom": {
                "title": "Time",
                "scaleType": "time",
                "mapsTo": "date"
            }
        },
        "legend": {
            "alignment": "center"
        },
        "data": {
            "loading": true
        },
        "curve": "curveMonotoneX",
        "height": "500px"
    };

    constructor(protected modalService: ModalService, private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getCropDistribution()
            .then(value => {
                this.data = value.map(value1 => {
                    return {
                        group: value1.crop,
                        value: value1.area / 1000
                    };
                }).sort(this.sortByGroup);
                this.options.legend["order"] = this.data.map(value1 => value1.group).sort();
                this.options.data.loading = false;
                this.options = {...this.options};
            })
            .catch(() => this.data = []);

        this.dashboardService.getCropProductionForecast()
            .then(value => {
                this.data2 = value.map(value1 => {
                    return {
                        group: value1.crop,
                        date: value1.date,
                        value: value1.yield,
                    };
                });
                this.options2.legend["order"] = this.data2.map(value1 => value1.group).sort();
                this.options2.data.loading = false;
                this.options2 = {...this.options2};
            })
            .catch(() => this.data2 = []);
    }

    sortByGroup(a, b) {
        const groupA = a.group.toUpperCase();
        const groupB = b.group.toUpperCase();
        return (groupA < groupB) ? -1 : (groupA > groupB) ? 1 : 0;
    }
}
