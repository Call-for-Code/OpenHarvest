

import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';

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

  constructor(@Inject("modalText") public modalText,
				@Inject("size") public size,
				protected modalService: ModalService) { 
		super();
	}

  ngOnInit(): void {
    this.lots = this.getLots();
    this.crops = this.getCrops();
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

  getCrops() {
    //Make http call to get crops

    return [{content: 'Sugarcane', selected: false}, {content: 'Rice', selected: false}, {content: 'Wheat', selected: false}];
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
