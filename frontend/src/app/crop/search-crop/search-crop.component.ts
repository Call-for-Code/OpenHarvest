import { Component, OnInit } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';

@Component({
  selector: 'app-search-crop',
  templateUrl: './search-crop.component.html',
  styleUrls: ['./search-crop.component.scss']
})
export class SearchCropComponent implements OnInit {

  searchCropModel = new TableModel();

  constructor() { }

  ngOnInit(): void {
    this.populateModel();
  }

  populateModel() {
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
