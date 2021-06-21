import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Login } from "./login";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    name = 'User Name';
    constructor(private http: HttpClient,
    private router: Router) {}

    authenticate(login: Login) {
        return this.http.post('/api/auth/login', login).toPromise();
    }

    logout() {
        this.http.post('/api/auth/logout', {}).subscribe((response) => {
            this.removeUserName();
            this.router.navigateByUrl("/");
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