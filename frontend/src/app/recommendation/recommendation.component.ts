

import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent extends BaseModal implements OnInit {

  constructor(@Inject("modalText") public modalText,
				@Inject("size") public size,
				protected modalService: ModalService) { 
		super();
	}

  ngOnInit(): void {
  }

}
