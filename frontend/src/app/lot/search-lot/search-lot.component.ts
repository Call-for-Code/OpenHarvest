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
}
