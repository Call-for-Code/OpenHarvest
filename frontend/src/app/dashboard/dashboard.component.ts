import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { CropComponent } from '../crop/crop.component';
import { LoginComponent } from '../login/login.component';
import { LotComponent } from '../lot/lot.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @Input() modalText = "Hello, World";

	@Input() size = "default";

  constructor(protected modalService: ModalService) { }

  ngOnInit(): void {
  }

  cropDialog() {
		this.modalService.create({
			component: CropComponent,
      inputs: {
				modalText: this.modalText,
				size: this.size
			}
		});
	}

  lotDialog() {
		this.modalService.create({
			component: LotComponent,
      inputs: {
				modalText: this.modalText,
				size: this.size
			}
		});
	}
}
