import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-crop',
  templateUrl: './update-crop.component.html',
  styleUrls: ['./update-crop.component.scss']
})
export class UpdateCropComponent implements OnInit {
  searchCrop = {cropId:''};
  cropData = {cropId: '', cropName: '', plantingSeason: '', harvestTime: ''};

  constructor() { }

  ngOnInit(): void {
  }

  isFormInvalid() {
    return this.isEmpty(this.cropData.cropId) || 
          this.isEmpty(this.cropData.cropName) ||
          this.isEmpty(this.cropData.plantingSeason) ||
          this.isEmpty(this.cropData.harvestTime);
  }

  isEmpty(val) {
    return val === '';
  }

  isSearchFormInvalid() {
    return !this.searchCrop || this.searchCrop.cropId === '';
  }

  findCrop() {
    this.cropData = {
      cropId: this.searchCrop.cropId, 
      cropName: 'Crop 1',
      plantingSeason: 'July',
      harvestTime: 'Oct'
    };
  }

  hasCrop() {
    return this.cropData.cropId !== '';
  }
}
