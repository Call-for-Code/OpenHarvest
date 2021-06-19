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
		"height": "400px"
	  };

  constructor(protected modalService: ModalService) { }

  ngOnInit(): void {
  }
}
