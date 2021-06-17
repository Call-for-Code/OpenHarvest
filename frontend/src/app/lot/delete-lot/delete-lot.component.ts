import { Component, OnInit } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';

@Component({
  selector: 'app-delete-lot',
  templateUrl: './delete-lot.component.html',
  styleUrls: ['./delete-lot.component.scss']
})
export class DeleteLotComponent implements OnInit {
  searchLot = {lotId:''};
  searchLotModel = new TableModel();

  constructor() { }

  ngOnInit(): void {
  }

  isSearchFormInvalid() {
    return !this.searchLot || this.searchLot.lotId === '';
  }

  findLot() {
    this.searchLotModel.header = [
      new TableHeaderItem({data: "ID"}),
      new TableHeaderItem({data: 'Name'})
    ];

    this.searchLotModel.data = [
      [
        new TableItem({data: "1"}), 
        new TableItem({data: "Lot 1"})        
      ]
    ];
  }

  isTableNotEmpty() {
    return this.searchLotModel.totalDataLength > 0;
  }

  deleteLot() {

  }

  isItemSelected() {
    return this.searchLotModel.selectedRowsCount() > 0;
  }

  isItemNotSelected() {
    return !this.isItemSelected();
  }

}
