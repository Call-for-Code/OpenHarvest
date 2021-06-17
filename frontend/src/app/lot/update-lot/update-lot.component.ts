import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-lot',
  templateUrl: './update-lot.component.html',
  styleUrls: ['./update-lot.component.scss']
})
export class UpdateLotComponent implements OnInit {
  searchLot = {lotId:''};
  lotData = {lotId: '', lotName: ''};

  constructor() { }

  ngOnInit(): void {
  }

  isFormInvalid() {
    return this.isEmpty(this.lotData.lotId) || 
          this.isEmpty(this.lotData.lotName);
  }

  isEmpty(val) {
    return val === '';
  }

  isSearchFormInvalid() {
    return !this.searchLot || this.searchLot.lotId === '';
  }

  findLot() {
    this.lotData = {
      lotId: this.searchLot.lotId, 
      lotName: 'Lot 1'
    };
  }

  hasLot() {
    return this.lotData.lotId !== '';
  }

}
