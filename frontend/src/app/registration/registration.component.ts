import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { Login } from '../login/login';
import { LoginService } from '../login/login.service';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends BaseModal implements OnInit {
  registrationForm: FormGroup;
  notification: Object;

  constructor(
    @Inject("modalText") public modalText,
		@Inject("size") public size,
    protected modalService: ModalService,
    protected registrationService: RegistrationService,
    protected loginService: LoginService) {
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
    const registration = this.registrationForm.value;
    this.registrationService.register(registration).then(response => {
      console.log('Response ', response);
      this.loginService.authenticate({name: registration.name, password: registration.password}).then((res: Login) => {
        this.loginService.setUserName(res.name);
        this.closeModal();
      });
      
    }).catch(e => {
      this.notification = {
        type: 'error',
        title: '',
        message: e.error,
        showClose: false,
        lowContrast: true
      };
    });
  }

  isFormInvalid() {
    return this.registrationForm.invalid;
  }

  showNotification() {
    return this.notification;
  }

}
