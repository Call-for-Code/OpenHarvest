import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "./login";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    name = 'User Name';
    constructor(private http: HttpClient) {}

    authenticate(login: Login) {
        return this.http.post('/api/auth/login', login).toPromise();
    }

    logout() {
        this.http.post('/api/auth/logout', {}).subscribe((response) => {
            this.removeUserName();
        });
    }

    isAlreadyLoggedIn() {
        return this.getUserName();
    }

    setUserName(name) {
        localStorage.setItem('name', name);
    }

    getUserName() {
        return localStorage.getItem('name');
    }

    removeUserName() {
        localStorage.removeItem('name');
    }
}