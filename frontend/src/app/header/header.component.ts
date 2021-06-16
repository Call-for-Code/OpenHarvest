import { Component, HostBinding, Input } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../login/login.service';
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

	constructor(protected modalService: ModalService,
				protected loginService: LoginService) {

	}

	loginDialog() {
		this.modalService.create({
			component: LoginComponent,
			inputs: {
				modalText: this.modalText,
				size: "xs"
			}
		});
	}

	registerDialog() {
		this.modalService.create({
			component: RegistrationComponent,
			inputs: {
				modalText: this.modalText,
				size: "xs"
			}
		});
	}

	isUserLoggedIn() {
		return this.loginService.isAlreadyLoggedIn();
	}

	logout() {
		this.loginService.logout();
	}
}
