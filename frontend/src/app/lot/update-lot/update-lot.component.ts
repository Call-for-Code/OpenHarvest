import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-lot',
  templateUrl: './update-lot.component.html',
  styleUrls: ['./update-lot.component.scss']
})
export class UpdateLotComponent implements OnInit {
  searchForm: FormGroup;
  updateForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      lotId: new FormControl('', [Validators.required])
    });

    this.updateForm = new FormGroup({
      lotId: new FormControl('', [Validators.required]),
      lotName: new FormControl('', [Validators.required])
    })
  }

  isFormInvalid() {
    return this.updateForm.invalid;
  }

  isSearchFormInvalid() {
    return this.searchForm.invalid;
  }

  findLot() {
    const lotData = {
      lotId: this.searchForm.get('lotId'),
      lotName: 'Lot 1'
    };

    this.updateForm.patchValue(lotData);
  }

  hasLot() {
    return this.updateForm.valid;
  }

}
