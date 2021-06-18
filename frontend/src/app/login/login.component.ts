import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { Login } from './login';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseModal implements OnInit {
  loginForm: FormGroup;

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
    this.loginService.authenticate(this.loginForm.value);

    this.closeModal();
  }

  isInvalidForm() {
    return this.loginForm.invalid;
  }

}
