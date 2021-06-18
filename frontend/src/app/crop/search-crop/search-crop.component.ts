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

  constructor(private cropService: CropService) { }

  async ngOnInit() {
    // this.populateModelWithTestData();

    this.searchCropModel.header = [
      new TableHeaderItem({ data: "ID" }),
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Planted Season' }),
      new TableHeaderItem({ data: 'Days until Harvest' })
    ];

    const crops = await this.cropService.getAllCrops();
    this.updateModel(crops);
  }

  updateModel(crops: Crop[]) {
    const dataArr = []
    for (const crop of crops) {
      dataArr.push([
        new TableItem({ data: crop._id }),
        new TableItem({ data: crop.name }),
        new TableItem({ data: `${crop.planting_season[0]} - ${crop.planting_season[1]}` }),
        new TableItem({ data: crop.time_to_harvest })
      ]);
    }
    this.searchCropModel.data = dataArr;
    console.log(this.searchCropModel.data);
  }
 
  populateModelWithTestData() {
    this.searchCropModel.header = [
      new TableHeaderItem({data: "ID"}),
      new TableHeaderItem({data: 'Name'}),
      new TableHeaderItem({data: 'Planted Season'}),
      new TableHeaderItem({data: 'Harvest Time'})
    ];

    this.searchCropModel.data = [
      [
        new TableItem({data: "1"}), 
        new TableItem({data: "Sugar"}), 
        new TableItem({data: "June"}), 
        new TableItem({data: "Oct"})
      ],
      [
        new TableItem({data: "2"}), 
        new TableItem({data: "Cotton"}), 
        new TableItem({data: "June"}), 
        new TableItem({data: "Oct"})
      ],
      [
        new TableItem({data: "3"}), 
        new TableItem({data: "Onion"}), 
        new TableItem({data: "June"}), 
        new TableItem({data: "Oct"})
      ]
    ];
  }

}
