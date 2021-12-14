import { Injectable } from '@angular/core';
import { environment as env } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    headers: HttpHeaders;
    constructor(private client: HttpClient) {
        this.headers = new HttpHeaders({ 'content-type': 'application/json' });
    }

    signUp(user: User): Observable<HttpResponse<any>> {
        return this.client.post<User>(env.apiAddress + '/signup', JSON.stringify(user), { headers: this.headers, observe: 'response' });
    }

    login(user: User): Observable<HttpResponse<any>> {
        return this.client.post<User>(env.apiAddress + '/login', JSON.stringify(user), { headers: this.headers, observe: 'response' });
    }

    logout() {
        sessionStorage.removeItem('user');
    }

    // Check is user is logged in current session.
    isLoggedIn(): Observable<Boolean> {
        const data = sessionStorage.getItem('user');
        if (data !== undefined && data !== null) return of(true)
        return of(false);
    }

    getCurentRole(): Observable<String> {
        return of(sessionStorage.getItem('role')!)
    }

    setCurentRole(data: string) {
        sessionStorage.setItem('role', data);
    }
    
    // Check if user data is saved and remebered before login 
    isRemembered(): Observable<Boolean> {
        const data = localStorage.getItem('user');
        if (data !== undefined && data !== null) return of(true)
        return of(false);
    }

    setCurrentSessionData(user:User) {
        sessionStorage.setItem("user", JSON.stringify(user));
    }

    setCurrentUserData(user: User, isSet=false) {
        if (isSet) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }

    getCurrentUserDetails(): Observable<User | null> {
        let data = localStorage.getItem('user');
        if (data !== undefined && data !== null) {
            const user: User = JSON.parse(data);
            return of(user);
        }
        else {
            data = sessionStorage.getItem('user');
            if (data !== undefined && data !== null) {
                const user: User = JSON.parse(data);
                return of(user)
            }
        }
        return of(null);
    }
}
