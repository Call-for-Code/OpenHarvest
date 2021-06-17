import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends BaseModal implements OnInit {
  registrationForm: FormGroup;

  constructor(
    @Inject("modalText") public modalText,
		@Inject("size") public size,
    protected modalService: ModalService,
    protected registrationService: RegistrationService) {
    super();
   }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')])
    });
  }

  register() {
    this.registrationService.register();
    this.closeModal();
  }

  isFormInvalid() {
    return this.registrationForm.invalid;
  }

}
