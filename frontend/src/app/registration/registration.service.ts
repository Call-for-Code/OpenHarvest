import { Injectable } from "@angular/core";
import { LoginService } from "../login/login.service";
import { Registration } from "./registration";

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(protected loginService: LoginService) {

    }

    register(registration: Registration) {
        //Register user and login automatically
        //register()
        this.loginService.authenticate({name: registration.name, password: registration.password});
    }
}