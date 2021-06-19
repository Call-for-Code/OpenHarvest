import { Component, HostBinding, Input } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { CropComponent } from '../crop/crop.component';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../login/login.service';
import { LotComponent } from '../lot/lot.component';
import {RecommendationComponent} from '../recommendation/recommendation.component';
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
	recommendationDialog(){
		this.modalService.create({
			component: RecommendationComponent,
			inputs: {
				modalText: this.modalText,
				size: "xs"
			}
		});
	}
	cropDialog() {
		this.modalService.create({
			component: CropComponent,
      inputs: {
				modalText: this.modalText,
				size: 'small'
			}
		});
	}

  	lotDialog() {
		this.modalService.create({
			component: LotComponent,
      inputs: {
				modalText: this.modalText,
				size: 'small'
			}
		});
	}

	isUserLoggedIn() {
		return this.loginService.isAlreadyLoggedIn();
	}

	logout() {
		this.loginService.logout();
	}

	getLoggedInUserName() {
		return this.loginService.name;
	}
}
