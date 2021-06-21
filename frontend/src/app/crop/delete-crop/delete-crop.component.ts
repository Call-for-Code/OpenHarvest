import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';
import { Crop, CropService } from '../crop.service';

@Component({
  selector: 'app-delete-crop',
  templateUrl: './delete-crop.component.html',
  styleUrls: ['./delete-crop.component.scss']
})
export class DeleteCropComponent implements OnInit {
  searchForm: FormGroup;
  searchNotification: Object;
  deleteNotification: Object;

  searchCropModel = new TableModel();

  constructor(private http: HttpClient,
    private service: CropService) { }

  ngOnInit(): void {

    this.searchForm = new FormGroup({
      cropId: new FormControl('', [Validators.required])
    });

    this.searchCropModel.header = [
      new TableHeaderItem({data: "ID"}),
      new TableHeaderItem({data: 'Name'}),
      new TableHeaderItem({data: 'Planted Season'}),
      new TableHeaderItem({data: 'Harvest Time'})
    ];
  }

  isSearchFormInvalid() {
    return this.searchForm.invalid;
  }

  findCrop() {
    const cropId = escape(this.searchForm.get('cropId').value);
    this.service.getCrop(cropId).then((res: Crop) => {
      this.searchCropModel.data = [
        [
          new TableItem({data: res._id}), 
          new TableItem({data: res.name}), 
          new TableItem({data: res.planting_season[0] + ' To ' + res.planting_season[1]}), 
          new TableItem({data: res.time_to_harvest})
        ]
      ];
    }).catch((e) => {
      this.setSearchNotification('error', 'Error finding crop!');
    });
  }

  isTableNotEmpty() {
    return this.searchCropModel.totalDataLength > 0;
  }

  deleteCrop() {
    const cropId = escape(this.searchForm.get("cropId").value);
    this.service.deleteCrop(cropId).then((response) => {
      this.setDeleteNotification('success', 'Crop deleted successfully');
      this.searchCropModel.data = [];
    }).catch((e) => {
      this.setDeleteNotification('error', 'Error deleting crop!');
    });
  }

  isItemSelected() {
    return this.searchCropModel.selectedRowsCount() > 0;
  }

  isItemNotSelected() {
    return !this.isItemSelected();
  }

  setSearchNotification(type, message) {
    this.searchNotification = {
      type: type,
      title: '',
      message: message,
      showClose: false,
      lowContrast: true
    };

    setTimeout(this.unsetSearchNotification.bind(this), 5000);
  }

  unsetSearchNotification() {
    this.searchNotification = undefined;
  }

  showSearchNotification() {
    return this.searchNotification;
  }

  setDeleteNotification(type, message) {
    this.deleteNotification = {
      type: type,
      title: '',
      message: message,
      showClose: false,
      lowContrast: true
    };

    setTimeout(this.unsetDeleteNotification.bind(this), 5000);
  }

  unsetDeleteNotification() {
    this.deleteNotification = undefined;
  }

  showDeleteNotification() {
    return this.deleteNotification;
  }
}
