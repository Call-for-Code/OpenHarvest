import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal, ListItem, ModalService } from "carbon-components-angular";
import { Subject } from "rxjs";
import { Crop, Crops_planted } from "../lot.service";

@Component({
  selector: 'app-lot-crop-edit-modal',
  templateUrl: './lot-crop-edit-modal.component.html',
  styleUrls: ['./lot-crop-edit-modal.component.scss']
})
export class LotCropEditModalComponent extends BaseModal implements OnInit {

  items: ListItem[]

  constructor(
    @Inject("crop") public crop: Crops_planted,
    @Inject("crops") public crops: Crop[],
    @Inject("finished") public finished: Subject<Crops_planted>,
    protected modalService: ModalService
  ) { 
    super();
    this.items = this.crops.map((it, idx) => {
      return {
        content: it.name,
        selected: it.name == crop.crop.name,
        idx
      }
    }) as any;

  }

  ngOnInit(): void {
  }

  setCropName(crop: Crops_planted, value: string) {
    crop.name = value;
  }

  setCropDate(crop: Crops_planted, dates: Date[], type: "Planted" | "Harvested") {
    if (type == "Planted") {
      crop.planted = dates[0];
    }
    else {
      crop.harvested = dates[0];
    }
  }

  save(shouldSave: boolean) {
    if (shouldSave) 
      this.finished.next(this.crop);
    else
      this.finished.next(null);
    
    this.closeModal();
  }

  cropSelected(event) {
    const idx = event.item.idx;
    
    const shouldChangeName = this.crop.name == this.crop.crop.name;

    this.crop.crop = this.crops[idx];
    
    if (shouldChangeName) {
      this.crop.name = this.crop.crop.name;
    };

    // console.log(shouldChangeName, this.crop);
  }

}
