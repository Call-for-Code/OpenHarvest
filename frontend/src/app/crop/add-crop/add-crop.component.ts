import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CropService } from '../crop.service';

@Component({
  selector: 'app-add-crop',
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.scss']
})
export class AddCropComponent implements OnInit {
  cropForm: FormGroup;
  notification: Object;

  constructor(private http: HttpClient,
    private service: CropService) { }

  ngOnInit(): void {
    this.cropForm = new FormGroup({
      cropName: new FormControl('', [Validators.required]),
      plantingSeasonFrom: new FormControl('', [Validators.required]),
      plantingSeasonTo: new FormControl('', [Validators.required]),
      harvestTime: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  isFormInvalid() {
    return this.cropForm.invalid;
  }

  addCrop() {
    this.unsetNotification();

    const crop = {
      _id: 'crop:' + this.cropForm.get("cropName").value,
      type: 'crop',
      name: this.cropForm.get("cropName").value + '',
      planting_season: [this.cropForm.get("plantingSeasonFrom").value + '', this.cropForm.get("plantingSeasonTo").value + ''],
      time_to_harvest: Number.parseInt(this.cropForm.get('harvestTime').value)
    };

    this.service.addCrop(crop).then(res => {
      this.setNotification('success', 'Added crop successfully!');
    }).catch((e) => {
      this.setNotification('error', e.error);
    });
  }

  showNotification() {
    return this.notification;
  }

  setNotification(type, message) {
    this.notification = {
      type: type,
      title: '',
      message: message,
      showClose: false,
      lowContrast: true
    };

    setTimeout(this.unsetNotification.bind(this), 5000);
  }

  unsetNotification() {
    this.notification = undefined;
  }
}
