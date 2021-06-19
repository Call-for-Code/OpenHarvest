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
    const crop = {
      _id: '',
      _rev: '',
      type: 'crop',
      name: this.cropForm.get("cropName").value + '',
      planting_season: [this.cropForm.get("plantingSeasonFrom").value + '', this.cropForm.get("plantingSeasonTo").value + ''],
      time_to_harvest: Number.parseInt(this.cropForm.get('harvestTime').value)
    };

    this.service.addCrop(crop).then(res => {
      console.log('Added crop', res);
    });
  }

}
