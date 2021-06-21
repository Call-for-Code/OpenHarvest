

import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { Crop, CropService } from '../crop/crop.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent extends BaseModal implements OnInit {
  lots: Array<Object>;
  crops: Array<Object>;
  selectedLot = [];
  selectedCrop = [];

  constructor(protected modalService: ModalService,
    private cropService: CropService) { 
		super();
	}

  ngOnInit(): void {
    this.lots = this.getLots();
    this.setCrops();
  }

  recommend() {
  }

  isFormInvalid() {
    return !this.selectedCrop || this.selectedCrop.length === 0 || 
           !this.selectedLot || this.selectedLot.length === 0;
  }

  getLots() {
    //Make http call to get lots

    return [{content: 'Lot 1', selected: false}, {content: 'Lot 2', selected: false}, {content: 'Lot 3', selected: false}];
  }

  setCrops() {
    this.cropService.getAllCrops().then((crops: Crop[]) => {
      const data = [];
      crops.forEach(crop => {
        data.push({content: crop.name, selected: false, value: crop});
      });

      this.crops = data;
    });
  }

  onSelectedLot(event) {
    console.log('Lot selected', event);
    console.log('selected Lot', this.selectedLot);
  }

  onSelectedCrop(event) {
    console.log('Crop selected', event);
    console.log('selected Crop', this.selectedCrop);
  }
}
