import { Component, OnInit } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';

@Component({
  selector: 'app-search-lot',
  templateUrl: './search-lot.component.html',
  styleUrls: ['./search-lot.component.scss']
})
export class SearchLotComponent implements OnInit {
  searchLotModel = new TableModel();

  constructor() { }

  ngOnInit(): void {
    this.populateModel();
  }

  populateModel() {
    this.searchLotModel.header = [
      new TableHeaderItem({data: "ID"}),
      new TableHeaderItem({data: 'Name'})
    ];

    this.searchLotModel.data = [
      [
        new TableItem({data: "1"}), 
        new TableItem({data: "Lot 1"})
      ],
      [
        new TableItem({data: "2"}), 
        new TableItem({data: "Lot 2"})
      ],
      [
        new TableItem({data: "3"}), 
        new TableItem({data: "Lot 3"})
      ]
    ];
  }

}
