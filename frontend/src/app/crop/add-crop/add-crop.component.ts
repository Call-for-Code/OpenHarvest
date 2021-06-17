import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-crop',
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.scss']
})
export class AddCropComponent implements OnInit {
  cropName;
  plantingSeason;
  harvestTime;

  constructor() { }

  ngOnInit(): void {
  }

  isFormInvalid() {
    return true;
  }

}
