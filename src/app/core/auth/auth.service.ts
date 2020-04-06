import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class authService {
  apiPath: string = environment.apiPath;
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router, private jwt: JwtHelperService) { }

  signup(newUser) {
    return this.http.post(`${this.apiPath}users`, newUser).pipe(
      catchError(errorRes => {
        return throwError(errorRes);
      })
    )
  }

  login(user) {
    return this.http.post<{login, token, refreshToken}>(`${this.apiPath}login`, user, {headers: {skip: 'true'}}).pipe(
      catchError(errorRes => {
        return throwError(errorRes)
      }), tap(
        resData => {
          this.handleAuthentication(resData.token, resData.refreshToken);
        }
      )
    )
  }

  logout() {
    this.user.next(null);
    localStorage.setItem('userData', null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    const tokens = {
      token: this.user.value.token,
      refreshToken: this.user.value.refreshToken
    }
    return this.http.post<{login: boolean, token: string}>(`${this.apiPath}refresh`, tokens, {headers: {skip: 'true'}});
  }

  handleAuthentication(token: string, refreshToken: string): void {
    const payload = this.jwt.decodeToken(token);
    
    this.user.next(new User(payload.email, payload.id, token, refreshToken));
    this.storeUserData(this.user.value);
    localStorage.setItem('refreshToken', refreshToken);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !this.jwt.isTokenExpired(token);
  }

  isTokenExpired(): boolean {
    return this.jwt.isTokenExpired(this.user.value.token);
  }

  autoLogin(): void {
    const user = JSON.parse(localStorage.getItem('userData'));
    if(!user) {
      return;
    }
    
    this.user.next(new User(user.email, user.id, user._token, user._refreshToken));
  }

  storeUserData(user: User): void  {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  updateToken(newToken: string): void {
    let user =  new User(this.user.value.email, this.user.value.id, newToken, this.user.value.refreshToken);
    this.storeUserData(user);
    this.user.next(user);
  }
}