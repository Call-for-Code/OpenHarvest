import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';

@Component({
	selector: 'app-crop',
	templateUrl: './crop.component.html',
	styleUrls: ['./crop.component.scss']
})
export class CropComponent extends BaseModal implements OnInit {
	addFormFlag = false;

	constructor(@Inject("modalText") public modalText,
				@Inject("size") public size,
				protected modalService: ModalService) { 
		super();
	}

	ngOnInit(): void {
	}

	showAddForm() {
		this.addFormFlag = true;
	}
}
