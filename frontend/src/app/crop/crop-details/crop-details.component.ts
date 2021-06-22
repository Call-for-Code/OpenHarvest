import { Component, Input, OnInit } from '@angular/core';
import { Crop } from "./../../lot/lot.service";

@Component({
  selector: 'app-crop-details',
  templateUrl: './crop-details.component.html',
  styleUrls: ['./crop-details.component.scss']
})
export class CropDetailsComponent implements OnInit {

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  @Input() crop: Crop;

  constructor() { }

  ngOnInit(): void {
  }

}
