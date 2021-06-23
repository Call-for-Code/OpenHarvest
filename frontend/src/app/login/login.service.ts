import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Lot } from "../lot/lot.service";
import { Login } from "./login";

export interface Farmer {
	_id: string;
	_rev: string;
	type: string;
	name: string;
	password: string;
	mobileNumber: string;
	lot_ids: string[];
    lots?: Lot[];
}

export interface UserInfo {
    username: string | null
    user: Farmer | null
}

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private userInfoSubject = new BehaviorSubject<UserInfo>({username: null, user: null});
    userInfo$ = this.userInfoSubject.asObservable();

    
    constructor(private http: HttpClient,
    private router: Router) { 
        const user = localStorage.getItem("OH-User");
        if (user) {
            this.userInfoSubject.next(JSON.parse(user));
        }
    }

    async authenticate(login: Login) {
        const result = await this.http.post<any>('/api/auth/login', login).toPromise();
        this.commitUser(result);
        return result;
    }

    logout() {
        this.http.post('/api/auth/logout', {}).subscribe((response) => {
            this.removeUserName();
            this.router.navigateByUrl("/");
        });
    }

    commitUser(user) {
        const savedObj = {
            username: user.name,
            user: user.user
        };
        localStorage.setItem("OH-User", JSON.stringify(savedObj));
        this.userInfoSubject.next(savedObj);
    }

    isAlreadyLoggedIn() {
        return this.getUserName() !== null;
    }

    getUserName() {
        return this.userInfoSubject.value.username;
    }

    removeUserName() {
        localStorage.removeItem('OH-User');
        this.userInfoSubject.next({
            username: null,
            user: null
        });
    }

    async updateFarmerLots(lots: Lot[]) {
        if (this.isAlreadyLoggedIn() == null) {
            return;
        }

        let response;
        let username = this.getUserName();
        for (let lot of lots) {
            response = await this.http.post<Farmer>(`/api/farmer/${username}/lot`, lot).toPromise();
        }
        console.log(response);
        this.commitUser({
            name: response.name,
            user: response
        });
        return response;
    }
}