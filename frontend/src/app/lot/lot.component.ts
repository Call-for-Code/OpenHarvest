import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';

@Component({
  selector: 'app-lot',
  templateUrl: './lot.component.html',
  styleUrls: ['./lot.component.scss']
})
export class LotComponent extends BaseModal implements OnInit {

  constructor(@Inject("modalText") public modalText,
				@Inject("size") public size,
				protected modalService: ModalService) { 
		super();
	}

  ngOnInit(): void {
  }

}
