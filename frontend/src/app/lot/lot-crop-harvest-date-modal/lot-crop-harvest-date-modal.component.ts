import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal } from "carbon-components-angular";
import { Subject } from "rxjs";

@Component({
  selector: 'app-lot-crop-harvest-date-modal',
  templateUrl: './lot-crop-harvest-date-modal.component.html',
  styleUrls: ['./lot-crop-harvest-date-modal.component.scss']
})
export class LotCropHarvestDateModalComponent extends BaseModal implements OnInit {

  date = new Date();

  constructor(@Inject("date") public dateSubject: Subject<Date>) { 
    super();
  }

  ngOnInit(): void {
  }

  setCropDate(newDate) {
    console.log(newDate);
  }

  save(shouldSave: boolean) {
    if (shouldSave) {
      this.dateSubject.next(this.date);
    }
    else {
      this.dateSubject.next(null);
    }

    this.closeModal();
  }

}
