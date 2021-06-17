import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-crop',
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.scss']
})
export class AddCropComponent implements OnInit {
  cropForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.cropForm = new FormGroup({
      cropName: new FormControl('', [Validators.required]),
      plantingSeason: new FormControl('', [Validators.required]),
      harvestTime: new FormControl('', [Validators.required])
    });
  }

  isFormInvalid() {
    return this.cropForm.invalid;
  }

}
