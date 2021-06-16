import { Component, HostBinding, Input } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	// adds padding to the top of the document, so the content is below the header
	@HostBinding('class.bx--header') headerClass = true;
	@Input() modalText = "Hello, World";

	@Input() size = "default";


	constructor(protected modalService: ModalService) {

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

	registerDialog() {
		this.modalService.create({
			component: RegistrationComponent,
			inputs: {
				modalText: this.modalText,
				size: this.size
			}
		});
	}
}
