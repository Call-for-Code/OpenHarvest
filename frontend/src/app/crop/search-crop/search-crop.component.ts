import { Component, OnInit } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';
import { Crop, CropService } from "../crop.service";

@Component({
  selector: 'app-search-crop',
  templateUrl: './search-crop.component.html',
  styleUrls: ['./search-crop.component.scss']
})
export class SearchCropComponent implements OnInit {

  searchCropModel = new TableModel();
  loading: boolean = true;
  monthNames: Array<String> = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  constructor(private cropService: CropService) { }

  async ngOnInit() {
    
    this.searchCropModel.header = [
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Planting Season' }),
      new TableHeaderItem({ data: 'Days until Harvest' }),
      new TableHeaderItem({ data: 'Yield (Kg/h)' })
    ];

    const crops = await this.cropService.getAllCrops();
    this.updateModel(crops);
    this.loading = false;
  }

  updateModel(crops: Crop[]) {
    const dataArr = []
    for (const crop of crops) {
      const plantingSeason = this.monthNames[Number.parseInt(crop.planting_season[0])-1] + ' - ' + 
      this.monthNames[Number.parseInt(crop.planting_season[1])-1];

      dataArr.push([
        new TableItem({ data: crop.name }),
        new TableItem({ data: plantingSeason }),
        new TableItem({ data: crop.time_to_harvest }),
        new TableItem({ data: crop.yield })
      ]);
    }
    this.searchCropModel.data = dataArr;
  }
 }
