import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-lot',
  templateUrl: './add-lot.component.html',
  styleUrls: ['./add-lot.component.scss']
})
export class AddLotComponent implements OnInit {
  lotName;
  
  constructor() { }

  ngOnInit(): void {
  }

  isFormInvalid() {
    return true;
  }
}
