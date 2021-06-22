import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { Registration } from '../registration/registration';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseModal implements OnInit {
  loginForm: FormGroup;
  notification: Object;

  constructor(
    @Inject("modalText") public modalText,
		@Inject("size") public size,
    protected modalService: ModalService,
    protected loginService: LoginService) {
    super();
   }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    //Login here and close when login is successful.
    this.loginService.authenticate(this.loginForm.value).then((res: Registration) => {
      this.closeModal();
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

  isInvalidForm() {
    return this.loginForm.invalid;
  }

  showNotification() {
    return this.notification;
  }

}
