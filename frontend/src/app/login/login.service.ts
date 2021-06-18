import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "./login";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    userName = '';
    loggedIn = true;
    constructor(private http: HttpClient) {}

    authenticate(login: Login) {
        console.log('Authenticated!!!');

        //Change URL here
        this.http.post('login', login).subscribe((response) => {
            this.loggedIn = true;
        });
    }

    logout() {
        this.loggedIn = false;
    }

    isAlreadyLoggedIn() {
        //Add logic to validate whether user is already logged in or not
        return this.loggedIn;
    }
}