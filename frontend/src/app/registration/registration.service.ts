import { Injectable } from "@angular/core";
import { LoginService } from "../login/login.service";

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(protected loginService: LoginService) {

    }

    register() {
        //Register user and login automatically
        //register()
        this.loginService.authenticate('', '');
    }
}