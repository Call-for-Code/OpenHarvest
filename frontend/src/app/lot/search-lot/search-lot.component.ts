import { Component, OnInit } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';
import { Lot, LotService } from '../lot.service';

@Component({
  selector: 'app-search-lot',
  templateUrl: './search-lot.component.html',
  styleUrls: ['./search-lot.component.scss']
})
export class SearchLotComponent implements OnInit {
  searchLotModel = new TableModel();

  constructor(private lotService: LotService) { }

  async ngOnInit() {
    this.searchLotModel.header = [
      new TableHeaderItem({data: "ID"}),
      new TableHeaderItem({data: 'Name'})
    ];

    const lots = await this.lotService.getAllLots();
    this.updateModel(lots);
  }

  updateModel(lots: Lot[]) {
    const dataArr = []
    for (const lot of lots) {
      dataArr.push([
        new TableItem({ data: lot._id }),
        new TableItem({ data: lot.name }),
      ]);
    }
    this.searchLotModel.data = dataArr;
  }

  populateModel() {
    this.searchLotModel.data = [];
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
