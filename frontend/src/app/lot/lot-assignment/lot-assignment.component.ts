import { Component, OnInit } from '@angular/core';
import { Feature } from "geojson";
import { Farmer, LoginService } from "./../../login/login.service";
import { CropService } from "./../../crop/crop.service";
import { Crop, Lot } from "./../lot.service";

@Component({
  selector: 'app-lot-assignment',
  templateUrl: './lot-assignment.component.html',
  styleUrls: ['./lot-assignment.component.scss']
})
export class LotAssignmentComponent implements OnInit {

  storedLots: Lot[] = [];
  storedLotKeys = [];

  crops: Crop[];

  farmer: Farmer;

  constructor(private cropService: CropService, private loginService: LoginService) { 
    
  }

  async ngOnInit() {
    this.crops = await this.cropService.getAllCrops() as unknown as Crop[];
    this.loginService.userInfo$.subscribe(item => {
      this.farmer = item.user;
      if (this.farmer && this.farmer.lots)
        this.farmer.lots.forEach(it => this.lotClicked(it));
    });
  }

  lotClicked(lot: Lot) {
    if (this.storedLotKeys.includes(lot._id)) {
      return;
    }
    this.storedLots.push(lot);
    this.storedLotKeys.push(lot._id);
    
    // Convert dates in lots
    lot.properties.data.crops_planted.forEach(it => {
      it.planted = it.planted == null ? null : new Date(it.planted);
      it.harvested = it.harvested == null ? null : new Date(it.harvested);
    });
  }

  lotSelected(event: any) {
    // console.log(event);
  }

  deleteLot(lot: Lot) {
    const id = lot._id
    let index = this.storedLots.indexOf(lot);
    this.storedLots.splice(index, 1);
    index = this.storedLotKeys.indexOf(id);
    this.storedLotKeys.splice(index, 1);
  }

  save() {
    console.log(this.storedLots.map(it => it.properties.data.crops_planted));
    const farmer = this.loginService.updateFarmerLots(this.storedLots);
  }

}
