import { Component, Inject, OnInit } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends BaseModal implements OnInit {
  name = '';
  password = '';
  mobileNumber = '';

  constructor(
    @Inject("modalText") public modalText,
		@Inject("size") public size,
    protected modalService: ModalService,
    protected registrationService: RegistrationService) {
    super();
   }

  ngOnInit(): void {
  }

  register() {
    this.registrationService.register();
    this.closeModal();
  }

  isFormInvalid() {
    return this.name === '' || this.password === '' || this.mobileNumber === '';
  }

}
