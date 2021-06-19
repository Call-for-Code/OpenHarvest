import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../login/login.service";
import { Registration } from "./registration";

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(protected loginService: LoginService,
        private http: HttpClient) {
    }

    register(registration: Registration) {
        this.http.post('/api/auth/register', registration).subscribe((response) => {
            this.loginService.authenticate({name: registration.name, password: registration.password});
        });
    }
}