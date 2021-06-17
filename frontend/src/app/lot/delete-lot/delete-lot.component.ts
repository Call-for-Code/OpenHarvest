import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';

@Component({
  selector: 'app-delete-lot',
  templateUrl: './delete-lot.component.html',
  styleUrls: ['./delete-lot.component.scss']
})
export class DeleteLotComponent implements OnInit {
  searchForm: FormGroup;
  
  searchLotModel = new TableModel();

  constructor() { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      lotId: new FormControl('', [Validators.required])
    });
  }

  isSearchFormInvalid() {
    return this.searchForm.invalid;
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
