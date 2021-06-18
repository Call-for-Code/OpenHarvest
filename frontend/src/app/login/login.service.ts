import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "./login";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    name = '';
    loggedIn = true;
    constructor(private http: HttpClient) {}

    authenticate(login: Login) {
        console.log('Authenticated!!!');

        //Change URL here
        this.http.post('http://localhost:3000/auth/login', login).subscribe((response: Login) => {
            this.loggedIn = true;
            this.name = response.name;
        });
    }

    logout() {

        this.http.post('http://localhost:3000/auth/logout', {}).subscribe((response) => {
            this.loggedIn = false;
        });
    }

    isAlreadyLoggedIn() {
        //Add logic to validate whether user is already logged in or not
        return this.loggedIn;
    }
}