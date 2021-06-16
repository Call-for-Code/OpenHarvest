import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { LoginComponent } from '../login/login.component';

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

  loginDialog() {
		this.modalService.create({
			component: LoginComponent,
      inputs: {
				modalText: this.modalText,
				size: this.size
			}
		});
	}
}
