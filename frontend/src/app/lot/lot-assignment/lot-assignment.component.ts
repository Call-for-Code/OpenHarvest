import { Component, OnInit } from '@angular/core';
import { Feature } from "geojson";
import { Lot } from "./../../pages/land-areas/land-areas.component";

@Component({
  selector: 'app-lot-assignment',
  templateUrl: './lot-assignment.component.html',
  styleUrls: ['./lot-assignment.component.scss']
})
export class LotAssignmentComponent implements OnInit {

  storedLots = [];
  storedLotKeys = [];

  constructor() { }

  ngOnInit(): void {
  }

  lotClicked(lot: Lot) {
    if (this.storedLotKeys.includes(lot._id)) {
      return;
    }
    this.storedLots.push(lot);
    this.storedLotKeys.push(lot._id);
  }

  lotSelected(event: any) {
    console.log(event);
  }

}
