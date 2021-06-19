
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recommendation-form',
  templateUrl: './recommendation-form.component.html',
  styleUrls: ['./recommendation-form.component.scss']
})
export class RecommendationFormComponent implements OnInit {
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