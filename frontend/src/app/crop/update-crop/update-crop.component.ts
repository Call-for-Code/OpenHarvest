import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Crop, CropService } from '../crop.service';

@Component({
  selector: 'app-update-crop',
  templateUrl: './update-crop.component.html',
  styleUrls: ['./update-crop.component.scss']
})
export class UpdateCropComponent implements OnInit {
  searchForm: FormGroup;
  updateForm: FormGroup;
  searchNotification: Object;
  updateNotification: Object;

  constructor(private http: HttpClient,
    private service: CropService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      cropId: new FormControl('', [Validators.required])
    });

    this.updateForm = new FormGroup({
      cropId: new FormControl('', [Validators.required]),
      cropName: new FormControl('', [Validators.required]),
      plantingSeasonFrom: new FormControl('', [Validators.required]),
      plantingSeasonTo: new FormControl('', [Validators.required]),
      harvestTime: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  isFormInvalid() {
    return this.updateForm.invalid;
  }

  isSearchFormInvalid() {
    return this.searchForm.invalid;
  }

  findCrop() {
    const cropId = escape(this.searchForm.get('cropId').value);
    this.service.getCrop(cropId).then((res: Crop) => {
      this.updateForm.patchValue({
        cropId: res._id,
        cropName: res.name,
        plantingSeasonFrom: res.planting_season[0],
        plantingSeasonTo: res.planting_season[1],
        harvestTime: res.time_to_harvest
      });
    }).catch((e) => {
      this.setSearchNotification('error', e.error);
    });
  }

  hasCrop() {
    return this.updateForm.valid;
  }

  updateCrop() {
    const crop = {
      _id: this.updateForm.get("cropId").value + '',
      type: 'crop',
      name: this.updateForm.get("cropName").value + '',
      planting_season: [this.updateForm.get("plantingSeasonFrom").value + '', this.updateForm.get("plantingSeasonTo").value + ''],
      time_to_harvest: Number.parseInt(this.updateForm.get('harvestTime').value)
    };

    this.service.updateCrop(crop).then((res: Crop) => {
      this.setUpdateNotification('success', 'Updated crop!');
    }).catch((e) => {
      console.log(e);
      this.setUpdateNotification('error', 'Error while updating crop!');
    });
  }

  setSearchNotification(type, message) {
    this.searchNotification = {
      type: type,
      title: '',
      message: message,
      showClose: false,
      lowContrast: true
    };

    setTimeout(this.unsetSearchNotification.bind(this), 5000);
  }

  unsetSearchNotification() {
    this.searchNotification = undefined;
  }

  setUpdateNotification(type, message) {
    this.updateNotification = {
      type: type,
      title: '',
      message: message,
      showClose: false,
      lowContrast: true
    };

    setTimeout(this.unsetUpdateNotification.bind(this), 5000);
  }

  unsetUpdateNotification() {
    this.updateNotification = undefined;
  }

  showSearchNotification() {
    return this.searchNotification;
  }

  showUpdateNotification() {
    return this.updateNotification;
  }
}
