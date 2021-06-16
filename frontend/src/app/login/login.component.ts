import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseModal implements OnInit {
  userName = '';
  password = '';

  constructor(
    @Inject("modalText") public modalText,
		@Inject("size") public size,
    protected modalService: ModalService,
    protected loginService: LoginService) {
    super();
   }

  ngOnInit(): void {
  }

  login() {
    //Login here and close when login is successful.

    this.loginService.authenticate(this.userName, this.password);

    this.closeModal();
  }

  isInvalidForm() {
    return this.userName === '' || this.password === '';
  }

}
