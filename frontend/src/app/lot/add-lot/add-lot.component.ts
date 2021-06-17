import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-lot',
  templateUrl: './add-lot.component.html',
  styleUrls: ['./add-lot.component.scss']
})
export class AddLotComponent implements OnInit {
  addForm: FormGroup;
  
  constructor() { }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      lotName: new FormControl('', [Validators.required])
    });
  }

  isFormInvalid() {
    return this.addForm.invalid;
  }
}
