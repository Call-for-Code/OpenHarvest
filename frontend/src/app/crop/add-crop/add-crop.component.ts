import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-crop',
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.scss']
})
export class AddCropComponent implements OnInit {
  cropForm: FormGroup;

  constructor(private http: HttpClient) { }

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

  addCrop() {
    this.http.post('/crop', this.cropForm.value).subscribe((response) => {
      //Crop added
      console.log("Added crop", this.cropForm.value);
      
    });
  }

}
