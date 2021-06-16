import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    userName = '';
    loggedIn = false;
    constructor() {}

    authenticate(userName, password) {
        console.log('Authenticated!!!');
        console.log(`user name ${userName}, password ${password}`);
        this.loggedIn = true;
        //API call is required here
    }

    logout() {
        this.loggedIn = false;
    }

    isAlreadyLoggedIn() {
        //Add logic to validate whether user is already logged in or not
        return this.loggedIn;
    }
}