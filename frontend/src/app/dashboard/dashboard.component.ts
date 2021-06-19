import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'carbon-components-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	data = [
		{
		  "group": "2V2N 9KYPM version 1",
		  "value": 20000
		},
		{
		  "group": "L22I P66EP L22I P66EP L22I P66EP",
		  "value": 65000
		},
		{
		  "group": "JQAI 2M4L1",
		  "value": 75000
		},
		{
		  "group": "J9DZ F37AP",
		  "value": 1200
		},
		{
		  "group": "YEL48 Q6XK YEL48",
		  "value": 10000
		},
		{
		  "group": "Misc",
		  "value": 25000
		}
	  ];

	  options = {
		"title": "Donut",
		"resizable": true,
		"donut": {
		  "center": {
			"label": "Browsers"
		  }
		},
		"height": "100px"
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
			"height": "400px"
		};
	

  constructor(protected modalService: ModalService) { }

  ngOnInit(): void {
  }
}
