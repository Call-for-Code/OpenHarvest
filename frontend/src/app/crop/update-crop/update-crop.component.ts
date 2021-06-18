import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-crop',
  templateUrl: './update-crop.component.html',
  styleUrls: ['./update-crop.component.scss']
})
export class UpdateCropComponent implements OnInit {
  searchForm: FormGroup;
  updateForm: FormGroup;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      cropId: new FormControl('', [Validators.required])
    });

    this.updateForm = new FormGroup({
      cropId: new FormControl('', [Validators.required]),
      cropName: new FormControl('', [Validators.required]),
      plantingSeason: new FormControl('', [Validators.required]),
      harvestTime: new FormControl('', [Validators.required])
    });
  }

  isFormInvalid() {
    return this.updateForm.invalid;
  }

  isSearchFormInvalid() {
    return this.searchForm.invalid;
  }

  findCrop() {
    const cropData = {
      cropId: this.searchForm.get('cropId'), 
      cropName: 'Crop 1',
      plantingSeason: 'July',
      harvestTime: 'Oct'
    };

    this.updateForm.patchValue(cropData);
  }

  hasCrop() {
    return this.updateForm.valid;
  }

  updateCrop() {
    this.http.put("/crop", this.updateForm.value).subscribe((response) => {
      console.log('Crop updated: ', this.updateForm.value);
    });
  }
}
