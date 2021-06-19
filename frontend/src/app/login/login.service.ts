import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "./login";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    name = 'User Name';
    loggedIn = true;
    constructor(private http: HttpClient) {}

    authenticate(login: Login) {
        console.log('Authenticated!!!');

        //Change URL here
        this.http.post('/api/auth/login', login).subscribe((response: Login) => {
            this.loggedIn = true;
            this.name = response.name;
        });
    }

    logout() {
        this.http.post('/api/auth/logout', {}).subscribe((response) => {
            this.loggedIn = false;
        });
    }

    isAlreadyLoggedIn() {
        //Add logic to validate whether user is already logged in or not
        return this.loggedIn;
    }
}