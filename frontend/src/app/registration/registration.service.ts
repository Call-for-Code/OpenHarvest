import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../login/login.service";
import { Registration } from "./registration";

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(private http: HttpClient) {
    }

    register(registration: Registration) {
        return this.http.post('/api/auth/register', registration).toPromise();
    }
}