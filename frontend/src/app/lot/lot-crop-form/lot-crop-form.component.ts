import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { ModalService, TableHeaderItem, TableItem, TableModel } from "carbon-components-angular";
import { Subject } from "rxjs";
import { CropService } from "./../../crop/crop.service";
// import { LotCropEditModalComponent } from "../lot-crop-edit-modal/lot-crop-edit-modal.component";
import { LotCropEditModalComponent } from "../lot-crop-edit-modal/lot-crop-edit-modal.component";
import { Crops_planted, Lot, Crop } from "./../lot.service";
import { LoginComponent } from "./../../login/login.component";
import { LotCropHarvestDateModalComponent } from "../lot-crop-harvest-date-modal/lot-crop-harvest-date-modal.component";

@Component({
  selector: 'app-lot-crop-form',
  templateUrl: './lot-crop-form.component.html',
  styleUrls: ['./lot-crop-form.component.scss']
})
export class LotCropFormComponent implements OnInit {

  @Input() lot: Lot;

  @Input() crops: Crop[]

  cropsPlantedModel = new TableModel();

  constructor(private modalService: ModalService) { }

  async ngOnInit() {
    this.cropsPlantedModel.header = [
      new TableHeaderItem({ data: "Name" }),
      new TableHeaderItem({ data: 'Planted' }),
      new TableHeaderItem({ data: 'Harvested' }),
      new TableHeaderItem({ data: 'Crop' }),
    ];
    this.updateTable();

    
  }

  private updateTable() {
    const dataArr = [];
    for (const crop of this.lot.properties.data.crops_planted) {
      dataArr.push([
        new TableItem({ data: crop.name }),
        new TableItem({ data: crop.planted ? crop.planted.toLocaleString() : "" }),
        new TableItem({ data: crop.harvested ? crop.harvested.toLocaleString() : "" }),
        new TableItem({ data: crop.crop.name }),
      ]);
    }
    this.cropsPlantedModel.data = dataArr;
  }

  cropSelected(event) {

  }

  addPlantedCrop() {
    const newPlantedCrop: Crops_planted = {
      name: this.crops[0].name,
      planted: new Date(),
      harvested: null,
      crop: this.crops[0]
    }
    const finished = new Subject<Crops_planted>();
    const ref: ComponentRef<LotCropEditModalComponent> = this.modalService.create<LotCropEditModalComponent>({
      component: LotCropEditModalComponent,
      inputs: {
        crop: newPlantedCrop,
        crops: this.crops,
        finished
      }
    });
    finished.subscribe(it => {
      if (it) {
        console.log("Closed", newPlantedCrop);
        this.lot.properties.data.crops_planted.push(newPlantedCrop);
        this.updateTable();
      }
    });
    // console.log(ref);
  }

  harvestCrop() {
    
    const selectedIdx = this.cropsPlantedModel.rowsSelected.map((it, idx) => it ? idx : false).filter(it => it !== false) as number[];

    // console.log(selectedIdx);

    const finished = new Subject<Date | null>();
    this.modalService.create<LotCropHarvestDateModalComponent>({
      component: LotCropHarvestDateModalComponent,
      inputs: {
        date: finished
      }
    });
    finished.subscribe(it => {
      if (it) {
        // console.log("Closed", it);
        for (let i = 0; i < selectedIdx.length; i++) {
          const idx = selectedIdx[i];
          if (!this.lot.properties.data.crops_planted[idx].harvested) {
            this.lot.properties.data.crops_planted[idx].harvested = it;
          }
        }
        setTimeout(() => {
          this.updateTable();
        }, 100);
        
      }
    });
  }

  deleteCrop() {
    const crops_planted = this.lot.properties.data.crops_planted;
    const itemsToDelete = this.cropsPlantedModel.rowsSelected.map((it, idx) => it ? idx : false).filter(it => it !== false).map(it => this.lot.properties.data.crops_planted[it as number]);
    console.log(itemsToDelete);
    
    for(let item of itemsToDelete) {
      const idx = crops_planted.indexOf(item);
      if (idx > -1) {
        crops_planted.splice(idx, 1);
      }
    }

    this.updateTable();
  }

}
